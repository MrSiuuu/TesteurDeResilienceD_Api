FROM node:18

WORKDIR /app

COPY . .

# Installer les dépendances React
RUN npm install

# Builder le React
RUN npm run build

# Aller dans le dossier serveur et installer
WORKDIR /app/server
RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]
