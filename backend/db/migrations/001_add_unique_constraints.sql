-- Migration: Ajouter les contraintes UNIQUE
-- Date: 2026-01-16
-- Description: Éviter les doublons de catégories et sous-catégories

-- 🔒 SÉCURITÉ: Contraintes UNIQUE pour éviter les doublons
-- Note: LOWER() pour rendre la contrainte insensible à la casse

-- Ajouter contrainte UNIQUE sur categories.nom
-- (IF NOT EXISTS n'est pas supporté pour CREATE INDEX, donc on vérifie avec DO)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE indexname = 'idx_categories_nom_unique'
    ) THEN
        CREATE UNIQUE INDEX idx_categories_nom_unique ON categories(LOWER(nom));
    END IF;
END $$;

-- Ajouter contrainte UNIQUE sur sous_categories (nom + category_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE indexname = 'idx_sous_categories_nom_category_unique'
    ) THEN
        CREATE UNIQUE INDEX idx_sous_categories_nom_category_unique ON sous_categories(LOWER(nom), category_id);
    END IF;
END $$;

-- Afficher un message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration 001 appliquée avec succès : contraintes UNIQUE ajoutées';
END $$;
