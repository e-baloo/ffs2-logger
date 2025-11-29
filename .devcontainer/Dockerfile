FROM node:24-bookworm


# System dependencies installation
RUN apt-get update && apt-get install -y \
    git \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Working directory configuration
WORKDIR /workspaces/ffs2-logger

# Corepack activation and global pnpm configuration
RUN corepack enable

# Pnpm configuration for all users
# RUN pnpm config set strict-ssl false --location=global

# Stay as root to avoid permission issues with mounted volumes
CMD ["bash"]