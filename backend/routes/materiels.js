import express from 'express';
import pool from '../db/connection.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /api/materiels - Récupérer tous les matériels
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, sc.nom as sous_category_nom, c.nom as category_nom
       FROM materiels m
       LEFT JOIN sous_categories sc ON m.sous_category_id = sc.id
       LEFT JOIN categories c ON sc.category_id = c.id
       ORDER BY m.nom ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des matériels:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/materiels/:id - Récupérer un matériel par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT m.*, sc.nom as sous_category_nom, sc.category_id, c.nom as category_nom
       FROM materiels m
       LEFT JOIN sous_categories sc ON m.sous_category_id = sc.id
       LEFT JOIN categories c ON sc.category_id = c.id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du matériel:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/materiels - Créer un nouveau matériel
router.post('/', [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('sous_category_id').isInt().withMessage('L\'ID de sous-catégorie doit être un entier')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, section, diametre, poids_au_metre, sous_category_id, metadata } = req.body;

    const result = await pool.query(
      `INSERT INTO materiels (nom, section, diametre, poids_au_metre, sous_category_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nom, section || null, diametre || null, poids_au_metre || null, sous_category_id, metadata || {}]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création du matériel:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/materiels/:id - Modifier un matériel
router.put('/:id', [
  body('nom').optional().notEmpty().withMessage('Le nom ne peut pas être vide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nom, section, diametre, poids_au_metre, sous_category_id, metadata } = req.body;

    // Construction dynamique de la requête UPDATE
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (nom !== undefined) {
      updates.push(`nom = $${paramCount++}`);
      values.push(nom);
    }
    if (section !== undefined) {
      updates.push(`section = $${paramCount++}`);
      values.push(section);
    }
    if (diametre !== undefined) {
      updates.push(`diametre = $${paramCount++}`);
      values.push(diametre);
    }
    if (poids_au_metre !== undefined) {
      updates.push(`poids_au_metre = $${paramCount++}`);
      values.push(poids_au_metre);
    }
    if (sous_category_id !== undefined) {
      updates.push(`sous_category_id = $${paramCount++}`);
      values.push(sous_category_id);
    }
    if (metadata !== undefined) {
      updates.push(`metadata = $${paramCount++}`);
      values.push(metadata);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    values.push(id);
    const query = `UPDATE materiels SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la modification du matériel:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/materiels/:id - Supprimer un matériel
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM materiels WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    }

    res.json({ message: 'Matériel supprimé avec succès', materiel: result.rows[0] });
  } catch (error) {
    console.error('Erreur lors de la suppression du matériel:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
