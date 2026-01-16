import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuration de la connexion PostgreSQL avec pool optimisé
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum 20 connexions dans le pool
  idleTimeoutMillis: 30000, // Ferme les connexions inactives après 30s
  connectionTimeoutMillis: 2000, // Timeout de connexion de 2s
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connecté à la base de données PostgreSQL');
});

// 🔒 SÉCURITÉ : Ne pas quitter l'app brutalement, laisser le graceful shutdown gérer
pool.on('error', (err) => {
  console.error('❌ Erreur de connexion à la base de données:', err);
  // Ne pas faire process.exit() ici - cela empêche le graceful shutdown
  // Les erreurs seront gérées par les requêtes individuelles
});

export default pool;
