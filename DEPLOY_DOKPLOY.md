# 🚀 Guide de Déploiement Dokploy - iEEL

## ⚠️ Problème Actuel

L'erreur `unknown instruction: version:` indique que Dokploy essaie de parser `docker-compose.yml` comme un Dockerfile. Vous devez **configurer le projet en mode Docker Compose**.

## ✅ Solution : Configuration dans Dokploy

### Étape 1 : Supprimer l'application actuelle (si créée)

1. Dans Dokploy, supprimez l'application existante
2. Recommencez la création

### Étape 2 : Créer une nouvelle application en mode Compose

1. Dans Dokploy, cliquez sur **"New Application"** ou **"New Service"**
2. **IMPORTANT** : Sélectionnez le type **"Docker Compose"** (PAS "Dockerfile" ou "Application")
3. Connectez votre repository GitHub : `Maxymou/iEEL-App`
4. Branche : `claude/ieel-inventory-app-koB9H` ou `main`

### Étape 3 : Configuration

Dans les paramètres de l'application :

#### Build Configuration
- **Type** : Docker Compose
- **Compose File** : `docker-compose.yml` (par défaut)
- **Build Command** : Laisser vide (Dokploy utilisera docker-compose)

#### Environment Variables
Ajouter la variable suivante :
```
DB_PASSWORD=votre_mot_de_passe_securise_ici
```

#### Ports
Dokploy détectera automatiquement les ports depuis docker-compose.yml :
- Port 80 (Frontend)
- Port 3000 (Backend API)
- Port 5432 (PostgreSQL - interne)

### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine
3. L'application sera disponible sur l'URL fournie par Dokploy

### Étape 5 : Seed des données (optionnel)

Une fois déployé, connectez-vous au conteneur backend :

```bash
# Via Dokploy terminal ou SSH
docker exec -it ieel-backend npm run seed
```

---

## 🔧 Alternative : Si Dokploy ne supporte pas Docker Compose

Si votre version de Dokploy ne supporte pas Docker Compose nativement, vous avez deux options :

### Option A : Déployer manuellement sur le serveur

```bash
# SSH sur votre serveur Dokploy
ssh user@votre-serveur

# Cloner le repo
git clone https://github.com/Maxymou/iEEL-App.git
cd iEEL-App

# Créer le fichier .env
echo "DB_PASSWORD=votre_mot_de_passe" > .env

# Lancer avec docker-compose
docker-compose up -d

# Seed (optionnel)
docker-compose exec backend npm run seed
```

### Option B : Utiliser 3 applications séparées dans Dokploy

Créer 3 applications distinctes dans Dokploy :

#### 1. PostgreSQL
- Type : PostgreSQL (base de données)
- Database : `ieel`
- User : `ieel_user`
- Password : Définir un mot de passe

#### 2. Backend
- Type : Dockerfile
- Dockerfile path : `backend/Dockerfile`
- Environment :
  ```
  DATABASE_URL=postgresql://ieel_user:PASSWORD@postgres:5432/ieel
  NODE_ENV=production
  PORT=3000
  ```

#### 3. Frontend
- Type : Dockerfile
- Dockerfile path : `frontend/Dockerfile`
- Dépend de : Backend

---

## 🐛 Dépannage

### Erreur : "unknown instruction: version"
**Cause** : Dokploy essaie de parser docker-compose.yml comme un Dockerfile
**Solution** : Configurer le projet en mode "Docker Compose" dans l'interface

### Les conteneurs ne démarrent pas
**Cause** : Variable DB_PASSWORD manquante
**Solution** : Ajouter `DB_PASSWORD` dans les variables d'environnement

### Frontend ne se connecte pas au backend
**Cause** : Nginx ne trouve pas le backend
**Solution** : Vérifier que tous les services sont sur le même réseau Docker

---

## 📞 Support

Si le problème persiste :
1. Vérifiez la version de Dokploy (doit supporter Docker Compose)
2. Consultez la documentation Dokploy sur les déploiements Compose
3. Utilisez l'option de déploiement manuel (Option A ci-dessus)
