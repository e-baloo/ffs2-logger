FROM node:24-bookworm


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
# RUN pnpm config set strict-ssl false --location=global

# Reste en root pour éviter les problèmes de permissions avec les volumes montés
CMD ["bash"]