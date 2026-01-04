# ⚡ Démarrage Rapide Dokploy

## 🎯 Vous avez le choix entre plusieurs Build Types ?

Si Dokploy propose uniquement : `dockerfile`, `nixpack`, `buildpacks`, `static`
→ **Suivez ce guide pour déployer 3 applications séparées**

---

## 📝 Résumé en 3 Étapes

### Étape 1 : PostgreSQL (Base de données)

**Créer une nouvelle application Database/PostgreSQL** ou utiliser l'image Docker :

```
Type: Database PostgreSQL (ou dockerfile avec image postgres:15-alpine)
Name: ieel-postgres
Database: ieel
User: ieel_user
Password: [CHOISIR_UN_PASSWORD]
```

📋 **Notez** : `ieel-postgres:5432` (URL interne)

---

### Étape 2 : Backend (API Node.js)

**Créer une nouvelle application** :

```yaml
Name: ieel-backend
Repository: Maxymou/iEEL-App
Branch: claude/ieel-inventory-app-koB9H

Build Type: dockerfile
Dockerfile Path: backend/Dockerfile
Context: backend

Port: 3000

Environment Variables:
  DATABASE_URL: postgresql://ieel_user:[PASSWORD]@ieel-postgres:5432/ieel
  NODE_ENV: production
  PORT: 3000
```

⚠️ Remplacez `[PASSWORD]` par le mot de passe de l'étape 1

**Après déploiement** - Créer les tables :
```bash
docker exec -it ieel-backend sh
apk add postgresql-client
psql $DATABASE_URL < db/schema.sql
npm run seed  # Optionnel : données de test
```

📋 **Notez** l'URL du backend : `http://ieel-backend:3000`

---

### Étape 3 : Frontend (React + Nginx)

**Créer une nouvelle application** :

```yaml
Name: ieel-frontend
Repository: Maxymou/iEEL-App
Branch: claude/ieel-inventory-app-koB9H

Build Type: dockerfile
Dockerfile Path: frontend/Dockerfile
Context: frontend

Port: 80

Environment Variables:
  VITE_API_URL: http://ieel-backend:3000/api
```

ℹ️ Si vous exposez le backend publiquement, utilisez son URL publique ici

---

## ✅ C'est tout !

Votre application iEEL est maintenant déployée sur Dokploy avec :
- ✅ Base de données PostgreSQL
- ✅ API Backend Node.js
- ✅ Frontend React

---

## 🔗 URLs d'accès

- **Frontend** : `http://[URL_FOURNIE_PAR_DOKPLOY]`
- **API Backend** : `http://[URL_BACKEND]/api/categories` (pour tester)

---

## 🐛 Problème ?

Consultez le guide complet : [DEPLOY_DOKPLOY_SEPARATE.md](./DEPLOY_DOKPLOY_SEPARATE.md)

---

## 💡 Astuce : Variables à préparer avant

Avant de commencer, préparez ces informations :

1. **DB_PASSWORD** : Mot de passe sécurisé pour PostgreSQL
2. **Repository** : `Maxymou/iEEL-App`
3. **Branch** : `claude/ieel-inventory-app-koB9H`

Copiez-les dans un fichier texte pour faciliter la configuration !
