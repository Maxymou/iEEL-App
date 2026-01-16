import express from 'express';
import { param, body, validationResult } from 'express-validator';
import pool from '../db/connection.js';

const router = express.Router();

// 🔒 Middleware de validation des erreurs
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/sous-categories - Récupérer toutes les sous-catégories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sc.*, c.nom as category_nom
       FROM sous_categories sc
       LEFT JOIN categories c ON sc.category_id = c.id
       ORDER BY sc.nom ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/sous-categories/:id - Récupérer une sous-catégorie par ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID doit être un entier positif'),
  validate
], async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT sc.*, c.nom as category_nom
       FROM sous_categories sc
       LEFT JOIN categories c ON sc.category_id = c.id
       WHERE sc.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sous-catégorie non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la sous-catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/sous-categories/:id/materiels - Récupérer les matériels d'une sous-catégorie
router.get('/:id/materiels', [
  param('id').isInt({ min: 1 }).withMessage('ID doit être un entier positif'),
  validate
], async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM materiels WHERE sous_category_id = $1 ORDER BY nom ASC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des matériels:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/sous-categories - Créer une nouvelle sous-catégorie
router.post('/', [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('category_id').isInt({ min: 1 }).withMessage('category_id doit être un entier positif'),
  validate
], async (req, res) => {
  try {
    const { nom, category_id } = req.body;

    const result = await pool.query(
      'INSERT INTO sous_categories (nom, category_id) VALUES ($1, $2) RETURNING *',
      [nom, category_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la sous-catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/sous-categories/:id - Modifier une sous-catégorie
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID doit être un entier positif'),
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('category_id').optional().isInt({ min: 1 }).withMessage('category_id doit être un entier positif'),
  validate
], async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, category_id } = req.body;

    const result = await pool.query(
      'UPDATE sous_categories SET nom = $1, category_id = COALESCE($2, category_id) WHERE id = $3 RETURNING *',
      [nom, category_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sous-catégorie non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la modification de la sous-catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/sous-categories/:id - Supprimer une sous-catégorie
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID doit être un entier positif'),
  validate
], async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM sous_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sous-catégorie non trouvée' });
    }

    res.json({ message: 'Sous-catégorie supprimée avec succès', sousCategory: result.rows[0] });
  } catch (error) {
    console.error('Erreur lors de la suppression de la sous-catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
