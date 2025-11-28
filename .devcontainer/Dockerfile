FROM node:22-bookworm

# Variables d'environnement pour le proxy
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV HTTP_PROXY=http://host.docker.internal:9000
ENV HTTPS_PROXY=http://host.docker.internal:9000
ENV NO_PROXY=localhost,127.0.0.1,host.docker.internal
ENV http_proxy=http://host.docker.internal:9000
ENV https_proxy=http://host.docker.internal:9000
ENV no_proxy=localhost,127.0.0.1,host.docker.internal

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Configuration du répertoire de travail
WORKDIR /workspaces/ffs2-logger

# Activation de corepack et configuration pnpm globalement
RUN corepack enable

# Configuration pnpm pour tous les utilisateurs
RUN pnpm config set strict-ssl false --location=global

# Reste en root pour éviter les problèmes de permissions avec les volumes montés
CMD ["bash"]