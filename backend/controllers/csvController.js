import pool from '../db/connection.js';
import { Parser } from 'json2csv';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

// Export CSV - Exporter tous les matériels avec leur hiérarchie
export const exportCSV = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        m.nom,
        m.section,
        m.diametre,
        m.poids_au_metre,
        c.nom as categorie,
        sc.nom as sous_categorie
       FROM materiels m
       LEFT JOIN sous_categories sc ON m.sous_category_id = sc.id
       LEFT JOIN categories c ON sc.category_id = c.id
       ORDER BY c.nom, sc.nom, m.nom`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aucun matériel à exporter' });
    }

    // Définir les champs pour le CSV
    const fields = ['nom', 'section', 'diametre', 'poids_au_metre', 'categorie', 'sous_categorie'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(result.rows);

    // Headers pour téléchargement
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ieel-export.csv');
    res.status(200).send(csv);

    console.log(`✅ Export CSV réussi: ${result.rows.length} matériels exportés`);
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'export CSV' });
  }
};

// Import CSV - Importer des matériels depuis un fichier CSV
export const importCSV = async (req, res) => {
  // 🔒 SÉCURITÉ : Flag pour éviter double réponse HTTP (ERR_HTTP_HEADERS_SENT)
  let responseSent = false;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const results = [];
    const errors = [];

    // Parse le CSV depuis le buffer
    const readable = Readable.from(req.file.buffer.toString());

    readable
      .pipe(csvParser())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        if (responseSent) return; // 🔒 Éviter double réponse

        // 🔒 TRANSACTION : Utiliser une transaction pour garantir l'atomicité
        const client = await pool.connect();
        try {
          await client.query('BEGIN');

          let imported = 0;
          let skipped = 0;

          for (let i = 0; i < results.length; i++) {
            const row = results[i];
            const lineNumber = i + 2; // +2 car ligne 1 = header, et index commence à 0

            try {
              const { nom, section, diametre, poids_au_metre, categorie, sous_categorie } = row;

              // Validation des champs requis
              if (!nom || !categorie || !sous_categorie) {
                errors.push({
                  line: lineNumber,
                  error: 'Champs requis manquants (nom, categorie, sous_categorie)',
                  data: row
                });
                skipped++;
                continue;
              }

              // Trouver ou créer la catégorie (utiliser client au lieu de pool)
              let categoryResult = await client.query(
                'SELECT id FROM categories WHERE nom = $1',
                [categorie]
              );

              let categoryId;
              if (categoryResult.rows.length === 0) {
                const newCategory = await client.query(
                  'INSERT INTO categories (nom) VALUES ($1) RETURNING id',
                  [categorie]
                );
                categoryId = newCategory.rows[0].id;
                console.log(`📁 Catégorie créée: ${categorie}`);
              } else {
                categoryId = categoryResult.rows[0].id;
              }

              // Trouver ou créer la sous-catégorie
              let sousCategoryResult = await client.query(
                'SELECT id FROM sous_categories WHERE nom = $1 AND category_id = $2',
                [sous_categorie, categoryId]
              );

              let sousCategoryId;
              if (sousCategoryResult.rows.length === 0) {
                const newSousCategory = await client.query(
                  'INSERT INTO sous_categories (nom, category_id) VALUES ($1, $2) RETURNING id',
                  [sous_categorie, categoryId]
                );
                sousCategoryId = newSousCategory.rows[0].id;
                console.log(`📂 Sous-catégorie créée: ${sous_categorie}`);
              } else {
                sousCategoryId = sousCategoryResult.rows[0].id;
              }

              // Insérer le matériel
              await client.query(
                `INSERT INTO materiels (nom, section, diametre, poids_au_metre, sous_category_id)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                  nom,
                  section || null,
                  diametre || null,
                  poids_au_metre ? parseFloat(poids_au_metre) : null,
                  sousCategoryId
                ]
              );

              imported++;
            } catch (rowError) {
              console.error(`Erreur ligne ${lineNumber}:`, rowError);
              errors.push({
                line: lineNumber,
                error: rowError.message,
                data: row
              });
              skipped++;
            }
          }

          // 🔒 COMMIT : Si tout s'est bien passé, valider la transaction
          await client.query('COMMIT');

          responseSent = true;
          res.json({
            message: 'Import CSV terminé',
            imported,
            skipped,
            total: results.length,
            errors: errors.length > 0 ? errors : undefined
          });

          console.log(`✅ Import CSV réussi: ${imported}/${results.length} matériels importés`);
        } catch (processError) {
          // 🔒 ROLLBACK : En cas d'erreur, annuler toute la transaction
          await client.query('ROLLBACK');
          console.error('Erreur lors du traitement du CSV:', processError);

          if (!responseSent) {
            responseSent = true;
            res.status(500).json({ error: 'Erreur lors du traitement du CSV' });
          }
        } finally {
          // Toujours libérer le client
          client.release();
        }
      })
      .on('error', (error) => {
        console.error('Erreur lors de la lecture du CSV:', error);

        if (!responseSent) {
          responseSent = true;
          res.status(500).json({ error: 'Erreur lors de la lecture du CSV' });
        }
      });
  } catch (error) {
    console.error('Erreur lors de l\'import CSV:', error);

    if (!responseSent) {
      responseSent = true;
      res.status(500).json({ error: 'Erreur serveur lors de l\'import CSV' });
    }
  }
};
