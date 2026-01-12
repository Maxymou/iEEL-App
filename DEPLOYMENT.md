# 🚀 Guide de Déploiement en Production - iEEL

Ce document détaille l'architecture de déploiement en production de l'application iEEL sur Dokploy avec Nginx Proxy Manager.

## 📋 Table des Matières

1. [Architecture Réseau](#architecture-réseau)
2. [Configuration des Services](#configuration-des-services)
3. [Résolution du Problème 502 Bad Gateway](#résolution-du-problème-502-bad-gateway)
4. [Configuration Dokploy](#configuration-dokploy)
5. [Vérification et Tests](#vérification-et-tests)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Réseau

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Internet                                  │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│              Nginx Proxy Manager (NPM)                                │
│              - Gestion du SSL/TLS                                     │
│              - Terminaison HTTPS                                      │
│              - Redirige en HTTP vers Dokploy/Traefik                  │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ HTTP
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Dokploy / Traefik                                  │
│                    - Reverse proxy interne                            │
│                    - Routing vers les conteneurs                      │
│                    - HTTPS désactivé (déjà géré par NPM)              │
└──────────┬──────────────────────────────────┬────────────────────────┘
           │                                  │
           │ HTTP                             │ HTTP
           ▼                                  ▼
┌──────────────────────┐         ┌──────────────────────────┐
│   Frontend Container │         │   Backend Container       │
│   (Nginx + React)    │         │   (Node.js/Express)       │
│   Port interne: 80   │─────────│   Port interne: 3000      │
│                      │  Proxy  │   Écoute: 0.0.0.0        │
└──────────────────────┘         └────────────┬──────────────┘
                                               │
                                               ▼
                                 ┌──────────────────────────┐
                                 │   PostgreSQL Database     │
                                 │   Port interne: 5432      │
                                 └──────────────────────────┘
```

### Domaines et Routing

| Service    | Domaine                      | Port Interne | Protocole NPM → Dokploy | Protocole Dokploy → Service |
|------------|------------------------------|--------------|-------------------------|------------------------------|
| Frontend   | `ieel.app.redyx.fr`          | 80           | HTTP                    | HTTP                         |
| Backend    | `api.ieel.app.redyx.fr`      | 3000         | HTTP                    | HTTP                         |
| Database   | Interne seulement            | 5432         | N/A                     | TCP                          |

### Flux de Requête

#### Frontend (ieel.app.redyx.fr)
```
Client → NPM (HTTPS:443) → Traefik (HTTP:80) → Frontend Container (HTTP:80) → Nginx → React SPA
```

#### Backend (api.ieel.app.redyx.fr)
```
Client → NPM (HTTPS:443) → Traefik (HTTP:3000) → Backend Container (HTTP:3000) → Express API
```

#### API depuis le Frontend (proxifiée)
```
Browser → Frontend (HTTP:80) → Nginx proxy → Backend Container (HTTP:3000)
```

---

## ⚙️ Configuration des Services

### 1. Frontend (Nginx + React)

**Dockerfile** (`frontend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration** (`frontend/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Proxy API requests to backend
    location /api {
        proxy_pass http://ieel-ieelbackend-a6nug8:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React Router - toutes les routes vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Points Critiques** :
- ✅ **Port 80** : Le frontend DOIT écouter sur le port 80 (port standard HTTP)
- ✅ **Nom du service backend** : Utilisez le nom généré par Dokploy (ex: `ieel-ieelbackend-a6nug8`)
- ✅ **Proxy /api** : Les requêtes API sont proxifiées vers le backend depuis Nginx

### 2. Backend (Node.js/Express)

**Dockerfile** (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Configuration serveur** (`backend/server.js:120`)
```javascript
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`📍 URL: http://0.0.0.0:${PORT}`);
  // ...
});
```

**Points Critiques** :
- ✅ **Écoute sur 0.0.0.0** : ESSENTIEL pour être accessible depuis d'autres conteneurs
- ✅ **Port 3000** : Port exposé et utilisé par le backend
- ❌ **Erreur commune** : Écouter sur `localhost` ou `127.0.0.1` rend le service inaccessible

### 3. Database (PostgreSQL)

**Configuration Dokploy** :
```yaml
Type: PostgreSQL Database
Version: 15
Database: ieel
User: ieel_user
Password: [SECURE_PASSWORD]
```

**Connexion depuis le backend** :
```
DATABASE_URL=postgresql://ieel_user:[PASSWORD]@[SERVICE_NAME]:5432/ieel
```

---

## 🔧 Résolution du Problème 502 Bad Gateway

### Diagnostic Initial

Le déploiement initial générait une erreur **502 Bad Gateway**. Voici le processus de résolution :

### 1. Identification du Problème : Ports Incorrects

**Problème** : Le frontend exposait le port 3000 au lieu du port 80

**Impact** :
```
Traefik → Frontend:3000 ❌ (Aucun service n'écoute sur ce port)
Traefik → Frontend:80 ✅ (Nginx écoute ici)
```

**Solution** :
```yaml
# docker-compose.yml
frontend:
  ports:
    - "80:80"  # ✅ Correct
    # - "3000:80"  # ❌ Incorrect
```

### 2. Problème : Backend Inaccessible depuis le Réseau Docker

**Problème** : Le backend écoutait sur `localhost` uniquement

```javascript
// ❌ INCORRECT
app.listen(PORT, 'localhost', () => { ... });
// ou
app.listen(PORT, '127.0.0.1', () => { ... });
```

**Explication** :
- `localhost` / `127.0.0.1` : Accessible uniquement DEPUIS le conteneur
- `0.0.0.0` : Accessible depuis le réseau Docker (autres conteneurs)

**Solution** :
```javascript
// ✅ CORRECT
app.listen(PORT, '0.0.0.0', () => { ... });
```

### 3. Problème : Double Terminaison SSL

**Problème** : HTTPS activé dans Dokploy ET dans Nginx Proxy Manager

**Architecture incorrecte** :
```
Client → NPM (HTTPS) → Traefik (HTTPS) ❌ Double SSL
                       ↓
                   502 Bad Gateway
```

**Pourquoi ça échoue ?** :
1. NPM termine le SSL et envoie du HTTP vers Traefik
2. Traefik s'attend à recevoir du HTTPS (si configuré)
3. Mismatch de protocole → 502

**Solution** : Désactiver HTTPS dans Dokploy/Traefik

**Architecture correcte** :
```
Client → NPM (HTTPS) → Traefik (HTTP) → Services (HTTP) ✅
```

**Configuration dans Dokploy** :
- ✅ **HTTPS** : Désactivé
- ✅ **Certificate** : None
- ✅ **Port externe** : Port HTTP seulement

### 4. Problème : Nom du Service Backend Incorrect

**Problème** : Le frontend ne trouvait pas le backend dans le réseau Docker

```nginx
# ❌ INCORRECT
proxy_pass http://backend:3000;

# ✅ CORRECT (nom généré par Dokploy)
proxy_pass http://ieel-ieelbackend-a6nug8:3000;
```

**Comment trouver le bon nom ?** :
```bash
# Dans le conteneur frontend
docker exec -it ieel-frontend sh
nslookup ieel-ieelbackend-a6nug8
# ou
ping ieel-ieelbackend-a6nug8
```

### Résumé des Corrections

| Problème | Symptôme | Solution |
|----------|----------|----------|
| Port frontend incorrect | 502 sur ieel.app.redyx.fr | Exposer port 80 au lieu de 3000 |
| Backend écoute sur localhost | 502 sur requêtes /api | Écouter sur 0.0.0.0 |
| Double terminaison SSL | 502 intermittent | Désactiver HTTPS dans Dokploy |
| Nom service backend incorrect | 502 sur /api depuis frontend | Utiliser le nom Dokploy exact |

---

## 🎯 Configuration Dokploy

### Service Frontend

```yaml
Name: ieel-frontend
Build Type: dockerfile
Dockerfile Path: frontend/Dockerfile
Context Path: frontend/

Ports:
  - Container: 80
    Protocol: HTTP

Domains:
  - ieel.app.redyx.fr
  - HTTPS: Disabled
  - Certificate: None

Environment Variables:
  VITE_API_URL: /api  # Utilise le proxy Nginx interne
```

### Service Backend

```yaml
Name: ieel-backend (ou ieel-ieelbackend-a6nug8)
Build Type: dockerfile
Dockerfile Path: backend/Dockerfile
Context Path: backend/

Ports:
  - Container: 3000
    Protocol: HTTP

Domains:
  - api.ieel.app.redyx.fr
  - HTTPS: Disabled
  - Certificate: None

Environment Variables:
  DATABASE_URL: postgresql://ieel_user:[PASSWORD]@[DB_SERVICE]:5432/ieel
  NODE_ENV: production
  PORT: 3000
```

### Service PostgreSQL

```yaml
Name: ieel-postgres
Type: PostgreSQL Database
Version: 15

Database: ieel
User: ieel_user
Password: [SECURE_PASSWORD]

Volume: postgres_data
```

### Nginx Proxy Manager

**Configuration pour ieel.app.redyx.fr** :
```yaml
Domain: ieel.app.redyx.fr
Scheme: http  # ← IMPORTANT
Forward Hostname/IP: [DOKPLOY_HOST]
Forward Port: [TRAEFIK_PORT]
Cache Assets: Yes
Block Common Exploits: Yes
Websockets Support: Yes

SSL:
  - Force SSL: Yes
  - HTTP/2 Support: Yes
  - HSTS Enabled: Yes
  - Certificate: Let's Encrypt
```

**Configuration pour api.ieel.app.redyx.fr** :
```yaml
Domain: api.ieel.app.redyx.fr
Scheme: http  # ← IMPORTANT
Forward Hostname/IP: [DOKPLOY_HOST]
Forward Port: [TRAEFIK_PORT_BACKEND]
Cache Assets: No
Block Common Exploits: Yes
Websockets Support: Yes

SSL:
  - Force SSL: Yes
  - HTTP/2 Support: Yes
  - HSTS Enabled: Yes
  - Certificate: Let's Encrypt
```

---

## ✅ Vérification et Tests

### 1. Vérifier que les Services Fonctionnent

```bash
# Statut des conteneurs
docker ps | grep ieel

# Logs du frontend
docker logs -f ieel-frontend

# Logs du backend
docker logs -f ieel-backend

# Logs de la base de données
docker logs -f ieel-postgres
```

### 2. Tester les Endpoints

```bash
# Health check backend (depuis l'intérieur de Dokploy)
curl http://localhost:3000/health

# Frontend accessible
curl -I https://ieel.app.redyx.fr

# API accessible
curl https://api.ieel.app.redyx.fr/health

# API depuis le frontend (proxy Nginx)
curl https://ieel.app.redyx.fr/api/health
```

### 3. Vérifier la Résolution DNS

```bash
# Depuis le conteneur frontend
docker exec -it ieel-frontend sh
nslookup ieel-ieelbackend-a6nug8
ping ieel-ieelbackend-a6nug8

# Depuis le conteneur backend
docker exec -it ieel-backend sh
nslookup ieel-postgres
nc -zv ieel-postgres 5432
```

### 4. Tester l'API depuis le Navigateur

Ouvrez https://ieel.app.redyx.fr et testez :
1. Navigation vers les catégories
2. Affichage des sous-catégories
3. Affichage des matériels
4. Création d'un matériel
5. Export CSV

---

## 🐛 Troubleshooting

### Erreur : 502 Bad Gateway

**Causes possibles** :

1. **Service non démarré**
   ```bash
   docker ps | grep ieel
   # Vérifier que les 3 services sont UP
   ```

2. **Port incorrect**
   ```bash
   docker port ieel-frontend
   # Doit afficher : 80/tcp -> 0.0.0.0:XXXX
   ```

3. **Backend inaccessible**
   ```bash
   docker exec -it ieel-frontend sh
   wget -O- http://ieel-ieelbackend-a6nug8:3000/health
   # Doit retourner : {"status":"OK"}
   ```

4. **Double SSL activé**
   - Vérifier que HTTPS est désactivé dans Dokploy
   - Vérifier que NPM envoie du HTTP vers Traefik

### Erreur : Connection Refused

**Cause** : Le backend écoute sur localhost au lieu de 0.0.0.0

**Vérification** :
```bash
docker exec -it ieel-backend sh
netstat -tuln | grep 3000
# Doit afficher : 0.0.0.0:3000 (pas 127.0.0.1:3000)
```

**Solution** :
```javascript
// backend/server.js
app.listen(PORT, '0.0.0.0', () => { ... });
```

### Erreur : Cannot Connect to Database

**Vérifications** :

1. **Service PostgreSQL démarré**
   ```bash
   docker ps | grep postgres
   ```

2. **DATABASE_URL correct**
   ```bash
   docker exec -it ieel-backend sh
   echo $DATABASE_URL
   # postgresql://ieel_user:[PASSWORD]@ieel-postgres:5432/ieel
   ```

3. **Connectivité réseau**
   ```bash
   docker exec -it ieel-backend sh
   nc -zv ieel-postgres 5432
   # Connection to ieel-postgres 5432 port [tcp/*] succeeded!
   ```

### Erreur : API 404 Not Found depuis le Frontend

**Cause** : Le proxy Nginx ne redirige pas correctement vers le backend

**Vérification** :
```bash
# Vérifier le nom du service dans nginx.conf
docker exec -it ieel-frontend cat /etc/nginx/conf.d/default.conf | grep proxy_pass
# proxy_pass http://ieel-ieelbackend-a6nug8:3000;
```

**Solution** :
1. Récupérer le nom exact du service backend depuis Dokploy
2. Mettre à jour `frontend/nginx.conf`
3. Rebuild le frontend

### Erreur : SSL Certificate Error

**Cause** : Le certificat Let's Encrypt n'est pas configuré dans NPM

**Solution** :
1. Aller dans NPM → SSL Certificates
2. Ajouter un nouveau certificat Let's Encrypt
3. Associer le certificat aux domaines `ieel.app.redyx.fr` et `api.ieel.app.redyx.fr`
4. Activer "Force SSL" dans les proxy hosts

---

## 📊 Monitoring et Logs

### Logs en Temps Réel

```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker logs -f ieel-frontend
docker logs -f ieel-backend
docker logs -f ieel-postgres
```

### Métriques de Performance

```bash
# Utilisation des ressources
docker stats

# Connexions actives (Nginx)
docker exec -it ieel-frontend sh
ps aux | grep nginx

# Connexions PostgreSQL
docker exec -it ieel-postgres sh
psql -U ieel_user -d ieel -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## 🎓 Leçons Apprises

### 1. Ordre de Diagnostic

Lors d'un problème 502, suivre cet ordre :

1. **Vérifier les services** : Sont-ils démarrés ?
2. **Vérifier les ports** : Sont-ils correctement exposés ?
3. **Vérifier la résolution réseau** : Les services se voient-ils ?
4. **Vérifier les protocoles** : HTTP vs HTTPS
5. **Vérifier les logs** : Que disent les conteneurs ?

### 2. Architecture des Proxies

```
Internet → [SSL Termination] → [Routing] → [Services]
         (NPM)                 (Traefik)    (Containers)
```

**Règle d'or** : Un seul point de terminaison SSL (NPM dans notre cas)

### 3. Réseau Docker

- Utiliser les noms de services Docker comme hostname
- Toujours écouter sur `0.0.0.0` dans les conteneurs
- Ne jamais exposer les bases de données sur Internet

### 4. Variables d'Environnement

- Frontend : `/api` (utilise le proxy Nginx)
- Backend : Nom complet du service PostgreSQL
- Ne jamais hardcoder les mots de passe

---

## 📚 Ressources

- [Documentation Dokploy](https://docs.dokploy.com/)
- [Nginx Proxy Manager](https://nginxproxymanager.com/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Docker Networking](https://docs.docker.com/network/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## 📝 Changelog

| Date       | Version | Changement |
|------------|---------|------------|
| 2026-01-12 | 1.0.0   | Création du document après résolution du 502 Bad Gateway |

---

**Maintenu par** : Équipe iEEL
**Dernière mise à jour** : 12 janvier 2026
