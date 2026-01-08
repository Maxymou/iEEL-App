# 🚀 Déploiement Dokploy - Applications Séparées

## ⚠️ Note Importante

Si Dokploy ne propose pas d'option "Docker Compose" et seulement ces build types :
- dockerfile
- railpack
- nixpack
- heroku buildpacks
- paketo buildpacks
- static

Alors suivez ce guide pour déployer **3 applications séparées**.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :
- Accès à Dokploy
- Repository GitHub connecté : `Maxymou/iEEL-App`
- Branche : `claude/ieel-inventory-app-koB9H`

---

## 1️⃣ Créer la Base de Données PostgreSQL

### Option A : Via l'interface Dokploy (Recommandé)

Si Dokploy a une section "Databases" ou "PostgreSQL" :

1. Cliquez sur **"New Database"** ou **"Add PostgreSQL"**
2. Configurez :
   ```
   Name: ieel-postgres
   Database Name: ieel
   User: ieel_user
   Password: [CHOISIR_UN_MOT_DE_PASSE_SECURISE]
   ```
3. **Notez bien** :
   - Le mot de passe choisi
   - L'URL de connexion (généralement : `postgres:5432` ou `ieel-postgres:5432`)

### Option B : Conteneur PostgreSQL manuel

Si pas d'option base de données, créez une application :

1. **New Application**
2. **Build Type** : `dockerfile`
3. **Nom** : `ieel-postgres`
4. **Image Docker** : `postgres:15-alpine`
5. **Environment Variables** :
   ```
   POSTGRES_DB=ieel
   POSTGRES_USER=ieel_user
   POSTGRES_PASSWORD=[VOTRE_MOT_DE_PASSE]
   ```
6. **Volume** : Monter `/var/lib/postgresql/data`
7. **Port** : `5432` (interne uniquement)

**✅ Notez l'URL de connexion** : `ieel-postgres:5432` ou selon votre configuration Dokploy

---

## 2️⃣ Créer l'Application Backend

1. **New Application**
2. Configurez :

   **General Settings:**
   ```
   Name: ieel-backend
   Repository: Maxymou/iEEL-App
   Branch: claude/ieel-inventory-app-koB9H
   ```

   **Build Settings:**
   ```
   Build Type: dockerfile
   Dockerfile Path: backend/Dockerfile
   Context Path: backend
   ```

   **Port Mapping:**
   ```
   Container Port: 3000
   Public Port: 3000 (ou auto)
   ```

   **Environment Variables:**
   ```
   DATABASE_URL=postgresql://ieel_user:[MOT_DE_PASSE]@ieel-postgres:5432/ieel
   NODE_ENV=production
   PORT=3000
   ```

   ⚠️ **Important** : Remplacez `[MOT_DE_PASSE]` par le mot de passe de la BDD et `ieel-postgres` par l'URL réelle de votre base de données

3. **Deploy**

4. **Vérifiez les logs** que le backend démarre correctement

5. **Notez l'URL du backend** (ex: `http://ieel-backend:3000` ou l'URL publique fournie)

### Initialiser le schéma de la base de données

Une fois le backend déployé, il faut créer les tables :

**Option 1 - Via terminal Dokploy :**
```bash
# Se connecter au conteneur backend
docker exec -it ieel-backend sh

# Installer psql si nécessaire
apk add postgresql-client

# Créer les tables
psql $DATABASE_URL -f db/schema.sql

# Seed les données (optionnel)
npm run seed
```

**Option 2 - Via le conteneur PostgreSQL :**
```bash
# Se connecter au conteneur postgres
docker exec -it ieel-postgres sh

# Créer les tables
psql -U ieel_user -d ieel -f /path/to/schema.sql
```

---

## 3️⃣ Créer l'Application Frontend

1. **New Application**
2. Configurez :

   **General Settings:**
   ```
   Name: ieel-frontend
   Repository: Maxymou/iEEL-App
   Branch: claude/ieel-inventory-app-koB9H
   ```

   **Build Settings:**
   ```
   Build Type: dockerfile
   Dockerfile Path: frontend/Dockerfile
   Context Path: frontend
   ```

   **Port Mapping:**
   ```
   Container Port: 80
   Public Port: 80 (ou auto)
   ```

   **Environment Variables:**
   ```
   VITE_API_URL=http://[BACKEND_URL]/api
   ```

   ⚠️ **Important** : Remplacez `[BACKEND_URL]` par :
   - L'URL publique du backend si accessible de l'extérieur
   - OU `http://ieel-backend:3000` si sur le même réseau Docker

3. **Deploy**

---

## 🔗 Configuration du Networking

### Si les applications ne peuvent pas se parler

Dokploy devrait automatiquement mettre les conteneurs sur le même réseau, mais si ce n'est pas le cas :

1. Allez dans les paramètres réseau de chaque application
2. Assurez-vous qu'elles sont toutes sur le **même réseau Docker**
3. Utilisez les noms de conteneurs pour la communication interne :
   - Backend → PostgreSQL : `ieel-postgres:5432`
   - Frontend → Backend : `ieel-backend:3000`

---

## 🧪 Tester le Déploiement

### 1. Tester la Base de Données
```bash
docker exec -it ieel-postgres psql -U ieel_user -d ieel -c "SELECT COUNT(*) FROM categories;"
```

### 2. Tester le Backend
```bash
curl http://[BACKEND_URL]/api/categories
# ou
curl http://[VOTRE_DOMAINE]/api/categories
```

### 3. Tester le Frontend
Ouvrez l'URL publique du frontend dans votre navigateur

---

## 🌐 Configuration du Domaine

### Pour exposer l'application publiquement

1. **Frontend** : Configurez votre domaine (ex: `ieel.votredomaine.com`)
2. **Backend API** : Peut être sur un sous-domaine (ex: `api.ieel.votredomaine.com`)
3. **Mise à jour VITE_API_URL** dans le frontend avec l'URL publique de l'API

OU utilisez le **proxy Nginx** du frontend (déjà configuré dans `frontend/nginx.conf`) :
- Toutes les requêtes `/api` sont automatiquement proxifiées vers le backend
- Le frontend et le backend partagent le même domaine

---

## 📊 Seed des Données

Une fois tout déployé :

```bash
# Se connecter au backend
docker exec -it ieel-backend sh

# Exécuter le seed
npm run seed
```

Vous devriez voir :
```
🌱 Démarrage du seed de la base de données...
📁 Création des catégories...
  ✓ Câbles (ID: 1)
  ✓ Transformateurs (ID: 2)
  ✓ Accessoires (ID: 3)
...
✅ Seed terminé avec succès!
```

---

## 🔄 Ordre de Déploiement

**Important** : Déployez dans cet ordre pour éviter les erreurs :

1. ✅ PostgreSQL (database)
2. ✅ Backend (attend que PostgreSQL soit prêt)
3. ✅ Frontend (attend que Backend soit prêt)

---

## 🐛 Dépannage

### Backend ne peut pas se connecter à la BDD

**Vérifiez** :
1. `DATABASE_URL` est correct
2. Le mot de passe est correct
3. Les conteneurs sont sur le même réseau
4. PostgreSQL est bien démarré

**Solution** :
```bash
# Tester la connexion depuis le backend
docker exec -it ieel-backend sh
apk add postgresql-client
psql $DATABASE_URL -c "SELECT 1;"
```

### Frontend ne charge pas les données

**Vérifiez** :
1. `VITE_API_URL` pointe vers la bonne URL
2. Le backend est accessible depuis le navigateur (tester l'URL directement)
3. CORS est bien configuré (normalement déjà fait dans `backend/server.js`)

**Solution** :
- Ouvrez la console navigateur (F12)
- Regardez les erreurs réseau
- Vérifiez que les requêtes vont vers la bonne URL

### Tables non créées

**Solution** :
```bash
# Se connecter au backend
docker exec -it ieel-backend sh

# Installer psql
apk add postgresql-client

# Créer les tables
psql $DATABASE_URL < db/schema.sql
```

---

## ✅ Checklist Finale

- [ ] PostgreSQL déployé et accessible
- [ ] Backend déployé et se connecte à la BDD
- [ ] Tables créées (`schema.sql` exécuté)
- [ ] Frontend déployé et se connecte au backend
- [ ] Données de seed créées (optionnel)
- [ ] Application accessible via URL publique
- [ ] Import/Export CSV fonctionne

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de chaque conteneur dans Dokploy
2. Testez les connexions réseau entre conteneurs
3. Vérifiez les variables d'environnement

## 🎉 Félicitations !

Une fois tout configuré, votre application iEEL est en production ! 🚀
