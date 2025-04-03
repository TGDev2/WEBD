FROM node:16-alpine AS builder

WORKDIR /app

# Copier les dépendances
COPY package*.json /app/

# Installer les dépendances et Jest pour les tests
RUN npm install

# Copier tout le code source pour exécuter les tests
COPY . /app

# Lancer les tests Jest
RUN npm test

FROM nginx:alpine

# Copier les fichiers HTML/JS/CSS depuis le builder
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/*.js /usr/share/nginx/html/
COPY --from=builder /app/*.html /usr/share/nginx/html/
COPY --from=builder /app/*.css /usr/share/nginx/html/

# Exposer le port 80
EXPOSE 80
