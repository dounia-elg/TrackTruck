# Docker Setup - TrackTruck

## 📦 Images Docker

Ce projet contient des images Docker pour :
- **Backend** (Node.js + Express)
- **Frontend** (React + Vite + Nginx)
- **MongoDB** (Base de données)

## 🚀 Démarrage rapide

### Prérequis
- Docker Desktop installé
- Docker Compose installé

### Démarrer l'application

```bash
# Build et démarrer tous les services
docker-compose up --build

# Ou en mode détaché (background)
docker-compose up -d --build
```

### Accéder à l'application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Rebuild un service spécifique
docker-compose up -d --build backend

# Redémarrer un service
docker-compose restart backend

# Accéder au shell d'un container
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │  (Nginx:80)
│   (React)   │
└──────┬──────┘
       │
       │ HTTP
       │
┌──────▼──────┐
│   Backend   │  (Node:5000)
│  (Express)  │
└──────┬──────┘
       │
       │ MongoDB
       │
┌──────▼──────┐
│   MongoDB   │  (27017)
│  (Database) │
└─────────────┘
```

## 🔧 Configuration

### Variables d'environnement

**Backend** (dans `docker-compose.yml`) :
- `MONGODB_URI`: Connexion à MongoDB
- `JWT_SECRET`: Clé secrète pour JWT (⚠️ à changer en production)
- `PORT`: Port du serveur (5000)

**MongoDB** :
- `MONGO_INITDB_ROOT_USERNAME`: admin
- `MONGO_INITDB_ROOT_PASSWORD`: admin123 (⚠️ à changer en production)

### Modifier les ports

Pour changer les ports, éditez `docker-compose.yml` :

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 80 to 8080
  
  backend:
    ports:
      - "3000:5000"  # Change 5000 to 3000
```

## 📊 Volumes

- `mongodb_data`: Persiste les données MongoDB
- `./backend:/app`: Sync code backend (development)

## 🌐 Réseau

Tous les services communiquent via le réseau `tracktruck-network` (bridge).

## 🔒 Production

Pour la production, pensez à :

1. **Changer les secrets**
```yaml
environment:
  JWT_SECRET: "votre-vraie-clé-secrète-aléatoire"
  MONGO_INITDB_ROOT_PASSWORD: "mot-de-passe-fort"
```

2. **Supprimer les volumes de development**
```yaml
# Retirer cette ligne en production
volumes:
  - ./backend:/app
```

3. **Utiliser un fichier .env**
```bash
# Créer .env à la racine
JWT_SECRET=votre-secret
MONGO_PASSWORD=votre-password
```

Puis dans `docker-compose.yml`:
```yaml
env_file:
  - .env
```

## 🐛 Dépannage

### Les containers ne démarrent pas
```bash
# Vérifier les logs
docker-compose logs

# Vérifier l'état des containers
docker-compose ps
```

### Problème de connexion MongoDB
```bash
# Vérifier que MongoDB est prêt
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Réinitialiser complètement
```bash
# Arrêter et supprimer tout
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up --build
```

## 📝 Notes

- Le frontend utilise Nginx en production pour de meilleures performances
- Les routes React sont gérées par Nginx avec `try_files`
- Le proxy API `/api` redirige vers le backend
- MongoDB utilise l'authentification par défaut
