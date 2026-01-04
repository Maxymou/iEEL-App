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
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const results = [];
    const errors = [];
    let lineNumber = 0;

    // Parse le CSV depuis le buffer
    const readable = Readable.from(req.file.buffer.toString());

    readable
      .pipe(csvParser())
      .on('data', (data) => {
        lineNumber++;
        results.push({ ...data, lineNumber });
      })
      .on('end', async () => {
        try {
          let imported = 0;
          let skipped = 0;

          for (const row of results) {
            try {
              const { nom, section, diametre, poids_au_metre, categorie, sous_categorie } = row;

              // Validation des champs requis
              if (!nom || !categorie || !sous_categorie) {
                errors.push({
                  line: row.lineNumber,
                  error: 'Champs requis manquants (nom, categorie, sous_categorie)',
                  data: row
                });
                skipped++;
                continue;
              }

              // Trouver ou créer la catégorie
              let categoryResult = await pool.query(
                'SELECT id FROM categories WHERE nom = $1',
                [categorie]
              );

              let categoryId;
              if (categoryResult.rows.length === 0) {
                const newCategory = await pool.query(
                  'INSERT INTO categories (nom) VALUES ($1) RETURNING id',
                  [categorie]
                );
                categoryId = newCategory.rows[0].id;
                console.log(`📁 Catégorie créée: ${categorie}`);
              } else {
                categoryId = categoryResult.rows[0].id;
              }

              // Trouver ou créer la sous-catégorie
              let sousCategoryResult = await pool.query(
                'SELECT id FROM sous_categories WHERE nom = $1 AND category_id = $2',
                [sous_categorie, categoryId]
              );

              let sousCategoryId;
              if (sousCategoryResult.rows.length === 0) {
                const newSousCategory = await pool.query(
                  'INSERT INTO sous_categories (nom, category_id) VALUES ($1, $2) RETURNING id',
                  [sous_categorie, categoryId]
                );
                sousCategoryId = newSousCategory.rows[0].id;
                console.log(`📂 Sous-catégorie créée: ${sous_categorie}`);
              } else {
                sousCategoryId = sousCategoryResult.rows[0].id;
              }

              // Insérer le matériel
              await pool.query(
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
              console.error(`Erreur ligne ${row.lineNumber}:`, rowError);
              errors.push({
                line: row.lineNumber,
                error: rowError.message,
                data: row
              });
              skipped++;
            }
          }

          res.json({
            message: 'Import CSV terminé',
            imported,
            skipped,
            total: results.length,
            errors: errors.length > 0 ? errors : undefined
          });

          console.log(`✅ Import CSV réussi: ${imported}/${results.length} matériels importés`);
        } catch (processError) {
          console.error('Erreur lors du traitement du CSV:', processError);
          res.status(500).json({ error: 'Erreur lors du traitement du CSV' });
        }
      })
      .on('error', (error) => {
        console.error('Erreur lors de la lecture du CSV:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture du CSV' });
      });
  } catch (error) {
    console.error('Erreur lors de l\'import CSV:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'import CSV' });
  }
};
