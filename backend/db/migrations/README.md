# Migrations de base de données

Ce dossier contient les migrations SQL pour mettre à jour la base de données.

## Comment appliquer une migration ?

### Option 1 : Manuellement (psql)

```bash
# Se connecter à la base de données
psql $DATABASE_URL

# Exécuter la migration
\i backend/db/migrations/001_add_unique_constraints.sql
```

### Option 2 : Via Docker

```bash
# Docker Compose
docker-compose exec postgres psql -U ieel_user -d ieel -f /docker-entrypoint-initdb.d/migrations/001_add_unique_constraints.sql

# Ou copier le fichier et l'exécuter
docker cp backend/db/migrations/001_add_unique_constraints.sql ieel-postgres:/tmp/
docker-compose exec postgres psql -U ieel_user -d ieel -f /tmp/001_add_unique_constraints.sql
```

### Option 3 : Via Node.js

```bash
# Créer un script de migration (à venir)
npm run migrate
```

## Liste des migrations

- **001_add_unique_constraints.sql** - Ajoute les contraintes UNIQUE sur categories et sous_categories pour éviter les doublons

## Bonnes pratiques

1. **Toujours tester** les migrations sur une copie de la base de données de production
2. **Backuper** la base avant d'appliquer une migration
3. **Versionner** toutes les migrations dans Git
4. **Nommer** les migrations avec un numéro séquentiel et un nom descriptif
