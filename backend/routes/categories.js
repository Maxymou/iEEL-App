import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// GET /api/categories - Récupérer toutes les catégories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY nom ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des catégories' });
  }
});

// GET /api/categories/:id - Récupérer une catégorie par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/categories/:id/sous-categories - Récupérer les sous-catégories d'une catégorie
router.get('/:id/sous-categories', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM sous_categories WHERE category_id = $1 ORDER BY nom ASC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des sous-catégories' });
  }
});

// POST /api/categories - Créer une nouvelle catégorie
router.post('/', async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }

    const result = await pool.query(
      'INSERT INTO categories (nom) VALUES ($1) RETURNING *',
      [nom]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/categories/:id - Modifier une catégorie
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }

    const result = await pool.query(
      'UPDATE categories SET nom = $1 WHERE id = $2 RETURNING *',
      [nom, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la modification de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/categories/:id - Supprimer une catégorie
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    res.json({ message: 'Catégorie supprimée avec succès', category: result.rows[0] });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
