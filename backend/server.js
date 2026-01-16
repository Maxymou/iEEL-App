import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import pool from './db/connection.js';
import categoriesRouter from './routes/categories.js';
import sousCategoriesRouter from './routes/sousCategories.js';
import materielsRouter from './routes/materiels.js';
import { exportCSV, importCSV } from './controllers/csvController.js';

dotenv.config();

// 🔒 VALIDATION CRITIQUE : Vérifier que DATABASE_URL est définie
if (!process.env.DATABASE_URL) {
  console.error('❌ ERREUR FATALE: DATABASE_URL non définie dans .env');
  console.error('📝 Créez un fichier .env avec DATABASE_URL=postgresql://...');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration Multer pour l'upload de fichiers CSV
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers CSV sont acceptés'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

// 🔒 SÉCURITÉ : Configuration CORS sécurisée
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (comme Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origine non autorisée par CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// 🔒 SÉCURITÉ : Rate limiting contre les attaques DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par IP
  message: { error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API iEEL - Gestion d\'inventaire de matériel électrique',
    version: '1.0.0',
    endpoints: {
      categories: '/api/categories',
      sousCategories: '/api/sous-categories',
      materiels: '/api/materiels',
      importCSV: 'POST /api/import/csv',
      exportCSV: 'GET /api/export/csv'
    }
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'Disconnected', error: error.message });
  }
});

// Routes API
app.use('/api/categories', categoriesRouter);
app.use('/api/sous-categories', sousCategoriesRouter);
app.use('/api/materiels', materielsRouter);

// Routes CSV
app.post('/api/import/csv', upload.single('file'), importCSV);
app.get('/api/export/csv', exportCSV);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Fonction d'initialisation de la base de données
async function initDatabase() {
  try {
    // Vérifier si les tables existent
    const tablesCheck = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('categories', 'sous_categories', 'materiels')
    `);

    if (tablesCheck.rows.length < 3) {
      console.log('📊 Initialisation de la base de données...');
      // Les tables seront créées manuellement ou via migration
      console.log('⚠️  Veuillez exécuter le fichier schema.sql pour créer les tables');
    } else {
      console.log('✅ Tables de base de données détectées');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la base de données:', error);
  }
}

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', async () => {
  console.log('\n🚀 Serveur iEEL démarré');
  console.log(`📍 URL: http://0.0.0.0:${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Base de données: ${process.env.DATABASE_URL ? 'Configurée' : 'Non configurée'}\n`);

  await initDatabase();
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('⏹️  Signal SIGTERM reçu, fermeture du serveur...');
  pool.end(() => {
    console.log('🔌 Connexion à la base de données fermée');
    process.exit(0);
  });
});
