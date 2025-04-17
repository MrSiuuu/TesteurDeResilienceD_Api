#!/bin/bash

# Construire l'image Docker
echo "Construction de l'image Docker..."
docker build -t testeur-resilience-api .

# Arrêter le conteneur existant s'il existe
echo "Arrêt du conteneur existant s'il existe..."
docker stop testeur-resilience-api-container || true
docker rm testeur-resilience-api-container || true

# Lancer le nouveau conteneur
echo "Lancement du nouveau conteneur..."
docker run -d -p 5000:5000 --name testeur-resilience-api-container \
  -e OPENAI_API_KEY="$OPENAI_API_KEY" \
  -e NODE_ENV=production \
  testeur-resilience-api

echo "Déploiement terminé ! L'application est accessible sur http://localhost:5000" 