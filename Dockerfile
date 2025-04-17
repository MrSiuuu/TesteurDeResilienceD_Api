FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Définir la variable d'environnement pour la production
ENV NODE_ENV=production

# Builder l'application React
RUN npm run build

# Exposer le port sur lequel le serveur s'exécute
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["node", "server/server.js"]
