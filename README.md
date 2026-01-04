# 🔌 iEEL - Gestion d'Inventaire de Matériel Électrique

Application web full-stack pour la gestion d'un inventaire de matériel électrique avec navigation hiérarchique (Catégories → Sous-catégories → Matériels).

## 📚 Stack Technique

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express.js
- **Base de données**: PostgreSQL 15
- **Déploiement**: Docker + Docker Compose (compatible Dokploy)
- **Architecture**: Monorepo (frontend + backend)

## ✨ Fonctionnalités

- ✅ Navigation hiérarchique intuitive
- ✅ CRUD complet sur les matériels
- ✅ Import/Export CSV
- ✅ Design minimaliste Apple-like
- ✅ Responsive (mobile-first)
- ✅ API REST complète
- ✅ Relations CASCADE automatiques
- ✅ Dockerisé et prêt pour la production

## 🚀 Installation Rapide

### Prérequis

- Node.js 20+ (ou Docker)
- PostgreSQL 15+ (ou Docker)
- npm ou yarn

### 1️⃣ Cloner le repository

```bash
git clone https://github.com/votre-username/iEEL.git
cd iEEL
```

### 2️⃣ Option A : Avec Docker (Recommandé)

```bash
# Créer le fichier .env
echo "DB_PASSWORD=votre_mot_de_passe_securise" > .env

# Lancer l'application complète
docker-compose up -d

# Exécuter le seed pour les données de test (optionnel)
docker-compose exec backend npm run seed
```

L'application sera disponible sur :
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### 2️⃣ Option B : Installation locale

#### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL

# Créer la base de données
psql -U postgres -c "CREATE DATABASE ieel;"
psql -U postgres -d ieel -f db/schema.sql

# Lancer le serveur
npm start

# OU en mode développement
npm run dev

# Seed des données de test (optionnel)
npm run seed
```

#### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# Vérifier que VITE_API_URL pointe vers le backend

# Lancer le serveur de développement
npm run dev

# OU build pour la production
npm run build
npm run preview
```

## 🗄️ Structure de la Base de Données

### Tables

#### `categories`
- `id` (SERIAL PRIMARY KEY)
- `nom` (VARCHAR 255)
- `created_at` (TIMESTAMP)

#### `sous_categories`
- `id` (SERIAL PRIMARY KEY)
- `nom` (VARCHAR 255)
- `category_id` (INTEGER, FK → categories)
- `created_at` (TIMESTAMP)

#### `materiels`
- `id` (SERIAL PRIMARY KEY)
- `nom` (VARCHAR 255)
- `section` (VARCHAR 100)
- `diametre` (VARCHAR 100)
- `poids_au_metre` (DECIMAL 10,2)
- `sous_category_id` (INTEGER, FK → sous_categories)
- `metadata` (JSONB)
- `created_at` (TIMESTAMP)

### Relations
- `categories` → `sous_categories` (1:N, CASCADE)
- `sous_categories` → `materiels` (1:N, CASCADE)

## 📡 API REST

### Catégories

```
GET    /api/categories                    # Liste toutes les catégories
GET    /api/categories/:id                # Détails d'une catégorie
GET    /api/categories/:id/sous-categories # Sous-catégories d'une catégorie
POST   /api/categories                    # Créer une catégorie
PUT    /api/categories/:id                # Modifier une catégorie
DELETE /api/categories/:id                # Supprimer une catégorie
```

### Sous-catégories

```
GET    /api/sous-categories               # Liste toutes les sous-catégories
GET    /api/sous-categories/:id           # Détails d'une sous-catégorie
GET    /api/sous-categories/:id/materiels # Matériels d'une sous-catégorie
POST   /api/sous-categories               # Créer une sous-catégorie
PUT    /api/sous-categories/:id           # Modifier une sous-catégorie
DELETE /api/sous-categories/:id           # Supprimer une sous-catégorie
```

### Matériels

```
GET    /api/materiels                     # Liste tous les matériels
GET    /api/materiels/:id                 # Détails d'un matériel
POST   /api/materiels                     # Créer un matériel
PUT    /api/materiels/:id                 # Modifier un matériel
DELETE /api/materiels/:id                 # Supprimer un matériel
```

### CSV Import/Export

```
POST   /api/import/csv                    # Importer un CSV (multipart/form-data)
GET    /api/export/csv                    # Exporter tous les matériels en CSV
```

## 📄 Format CSV

### Import

Le fichier CSV doit contenir les colonnes suivantes :

```csv
nom,section,diametre,poids_au_metre,categorie,sous_categorie
Câble HTA 20kV,240 mm²,24 mm,1.85,Câbles,Haute tension
Câble BT 400V,95 mm²,15 mm,0.92,Câbles,Basse tension
Transformateur 20kV/400V 100kVA,N/A,N/A,,Transformateurs,Distribution
```

**Notes** :
- `nom`, `categorie` et `sous_categorie` sont **requis**
- Les catégories et sous-catégories sont créées automatiquement si elles n'existent pas
- Les champs vides sont acceptés pour section, diametre et poids_au_metre

### Export

Le CSV exporté contient toutes les informations des matériels avec leur hiérarchie complète.

## 🎨 Design

### Palette de couleurs

- Fond principal : `#FFFFFF`
- Fond secondaire : `#F5F5F7`
- Texte principal : `#1D1D1F`
- Texte secondaire : `#6E6E73`
- Accent (bleu) : `#0071E3`
- Bordures : `#D2D2D7`

### Principes

- Minimaliste et épuré (inspiration Apple)
- Coins arrondis (12px)
- Ombres subtiles
- Transitions douces (200ms)
- Responsive mobile-first

## 📁 Structure du Projet

```
iEEL/
├── backend/
│   ├── controllers/
│   │   └── csvController.js
│   ├── db/
│   │   ├── connection.js
│   │   ├── schema.sql
│   │   └── seed.js
│   ├── routes/
│   │   ├── categories.js
│   │   ├── sousCategories.js
│   │   └── materiels.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── SubCategoryList.jsx
│   │   │   ├── MaterielCard.jsx
│   │   │   ├── MaterielForm.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SubCategories.jsx
│   │   │   ├── Materiels.jsx
│   │   │   └── MaterielDetail.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── nginx.conf
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── .env.example
└── README.md
```

## 🔐 Variables d'Environnement

### Backend (.env)

```env
DATABASE_URL=postgresql://ieel_user:password@localhost:5432/ieel
PORT=3000
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

### Docker (.env à la racine)

```env
DB_PASSWORD=votre_mot_de_passe_securise
```

## 🐳 Déploiement sur Dokploy

### 🚀 Démarrage Rapide

Dokploy nécessite de **déployer 3 applications séparées** :

1. **PostgreSQL** (Database)
2. **Backend** (dockerfile : `backend/Dockerfile`)
3. **Frontend** (dockerfile : `frontend/Dockerfile`)

**📖 Guides disponibles :**
- **[QUICK_START_DOKPLOY.md](./QUICK_START_DOKPLOY.md)** ← Commencez par ici ! ⭐
- [DEPLOY_DOKPLOY_SEPARATE.md](./DEPLOY_DOKPLOY_SEPARATE.md) - Guide détaillé complet
- [DEPLOY_DOKPLOY.md](./DEPLOY_DOKPLOY.md) - Alternatives et dépannage

### Configuration rapide (3 apps)

**1. PostgreSQL**
```yaml
Type: PostgreSQL Database
Database: ieel
User: ieel_user
Password: [VOTRE_PASSWORD]
```

**2. Backend**
```yaml
Build Type: dockerfile
Path: backend/Dockerfile
Env: DATABASE_URL=postgresql://ieel_user:[PASSWORD]@ieel-postgres:5432/ieel
```

**3. Frontend**
```yaml
Build Type: dockerfile
Path: frontend/Dockerfile
Env: VITE_API_URL=http://ieel-backend:3000/api
```

### Après déploiement

Créer les tables et seed (optionnel) :
```bash
docker exec -it ieel-backend sh
apk add postgresql-client
psql $DATABASE_URL < db/schema.sql
npm run seed
```

## 🧪 Tests et Développement

### Tester l'API avec curl

```bash
# Récupérer toutes les catégories
curl http://localhost:3000/api/categories

# Créer un matériel
curl -X POST http://localhost:3000/api/materiels \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test Câble",
    "section": "150mm²",
    "sous_category_id": 1
  }'

# Importer un CSV
curl -X POST http://localhost:3000/api/import/csv \
  -F "file=@mon_fichier.csv"

# Exporter en CSV
curl http://localhost:3000/api/export/csv -o export.csv
```

### Scripts disponibles

#### Backend
```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en mode développement (nodemon)
npm run seed       # Remplir la DB avec des données de test
```

#### Frontend
```bash
npm run dev        # Serveur de développement Vite
npm run build      # Build pour la production
npm run preview    # Prévisualiser le build
```

## 🛠️ Technologies Détaillées

### Backend
- **Express.js** : Framework web minimaliste
- **pg** : Client PostgreSQL pour Node.js
- **multer** : Gestion de l'upload de fichiers
- **csv-parser** : Parse de fichiers CSV
- **json2csv** : Génération de fichiers CSV
- **express-validator** : Validation des données
- **cors** : Gestion CORS
- **dotenv** : Gestion des variables d'environnement

### Frontend
- **React 18** : UI library
- **React Router v6** : Routing
- **Axios** : Client HTTP
- **Tailwind CSS** : Framework CSS utility-first
- **Vite** : Build tool ultra-rapide

### DevOps
- **Docker** : Conteneurisation
- **Nginx** : Serveur web (frontend en production)
- **PostgreSQL** : Base de données relationnelle

## 📊 Données de Seed

Le script de seed crée :
- **3 catégories** : Câbles, Transformateurs, Accessoires
- **6 sous-catégories** : 2 par catégorie
- **30 matériels** : 5 par sous-catégorie

Pour réinitialiser les données :
```bash
npm run seed
```

## 🐛 Troubleshooting

### Problème de connexion à la base de données

```bash
# Vérifier que PostgreSQL est lancé
docker-compose ps

# Vérifier les logs
docker-compose logs postgres

# Recréer les conteneurs
docker-compose down -v
docker-compose up -d
```

### Le frontend ne se connecte pas au backend

Vérifier le fichier `frontend/.env` :
```env
VITE_API_URL=http://localhost:3000/api
```

En production avec Docker, le proxy Nginx gère automatiquement le routing.

### Port déjà utilisé

Modifier les ports dans `docker-compose.yml` :
```yaml
ports:
  - "8080:80"  # Frontend sur port 8080
  - "3001:3000"  # Backend sur port 3001
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📝 Licence

MIT

## 👤 Auteur

Projet créé dans le cadre de la gestion d'inventaire de matériel électrique iEEL.

---

**Fait avec ❤️ et React + Node.js**