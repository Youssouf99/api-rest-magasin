# Utilisation de l'image Node.js légère
FROM node:20-alpine

# Installer les dépendances nécessaires (netcat pour wait-for-it.sh)
RUN apk add --no-cache netcat-openbsd

# Utiliser l'utilisateur node existant dans l'image (au lieu d'en créer un nouveau)
WORKDIR /app

# Fixer les permissions pour l'utilisateur node
RUN chown node:node /app

# Basculer vers l'utilisateur node
USER node

# Copier uniquement les fichiers package.json et package-lock.json pour optimiser le cache
COPY --chown=node:node package*.json ./

# Installer les dépendances en fonction de l'environnement
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm ci --omit=dev

# Copier le reste des fichiers de l'application
COPY --chown=node:node . .

# Copier le script wait-for-it.sh et le rendre exécutable
COPY --chown=node:node wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Exposer le port de l'application
EXPOSE ${APP_PORT}

# Utiliser wait-for-it.sh pour attendre MySQL avant de démarrer l'application
ENTRYPOINT ["/wait-for-it.sh", "mysql", "3306", "--"]
CMD ["npm", "start"]