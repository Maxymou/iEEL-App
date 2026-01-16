-- Schéma de la base de données iEEL

-- Suppression des tables existantes (ordre important à cause des contraintes)
DROP TABLE IF EXISTS materiels CASCADE;
DROP TABLE IF EXISTS sous_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Table des catégories principales
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sous-catégories
CREATE TABLE sous_categories (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des matériels
CREATE TABLE materiels (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  section VARCHAR(100),
  diametre VARCHAR(100),
  poids_au_metre DECIMAL(10, 2),
  sous_category_id INTEGER REFERENCES sous_categories(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔒 Contraintes UNIQUE pour éviter les doublons
-- Note: LOWER() pour rendre la contrainte insensible à la casse
CREATE UNIQUE INDEX idx_categories_nom_unique ON categories(LOWER(nom));
CREATE UNIQUE INDEX idx_sous_categories_nom_category_unique ON sous_categories(LOWER(nom), category_id);

-- Index pour améliorer les performances
CREATE INDEX idx_sous_categories_category ON sous_categories(category_id);
CREATE INDEX idx_materiels_sous_category ON materiels(sous_category_id);

-- Commentaires pour documentation
COMMENT ON TABLE categories IS 'Catégories principales de matériel électrique';
COMMENT ON TABLE sous_categories IS 'Sous-catégories rattachées aux catégories principales';
COMMENT ON TABLE materiels IS 'Matériels électriques avec leurs caractéristiques techniques';
