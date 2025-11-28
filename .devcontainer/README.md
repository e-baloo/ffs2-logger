# Dev Container pour FFS2 Logger

Ce projet utilise un Dev Container pour fournir un environnement de développement cohérent.

## 🚀 Démarrage rapide

1. **Installer les prérequis** :
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - [VS Code](https://code.visualstudio.com/)
   - Extension VS Code : [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Ouvrir dans le container** :
   - Ouvrir VS Code dans le dossier du projet
   - Appuyer sur `F1` et sélectionner : `Dev Containers: Reopen in Container`
   - Ou cliquer sur l'icône `><` en bas à gauche et choisir "Reopen in Container"

3. **Première utilisation** :
   Le container va :
   - Télécharger l'image Node.js 20
   - Installer les dépendances avec `pnpm install`
   - Configurer Git

## 🔧 Configuration Proxy

Le Dev Container supporte automatiquement les proxys HTTP/HTTPS.

### Variables d'environnement

Les variables suivantes sont configurées automatiquement :
- `HTTP_PROXY` (défaut: `http://host.docker.internal:9000`)
- `HTTPS_PROXY` (défaut: `http://host.docker.internal:9000`)
- `NO_PROXY` (défaut: `localhost,127.0.0.1,host.docker.internal`)

**Important** : Le container Docker ne peut pas accéder à `127.0.0.1` ou `localhost` de l'hôte. 
Il faut utiliser `host.docker.internal` pour référencer la machine hôte.

### Personnalisation

Pour modifier les valeurs par défaut, définissez les variables sur votre machine hôte :

**Windows (PowerShell)** :
```powershell
$env:HTTP_PROXY = "http://host.docker.internal:8080"
$env:HTTPS_PROXY = "http://host.docker.internal:8080"
```

**Linux/macOS (Bash)** :
```bash
export HTTP_PROXY=http://host.docker.internal:8080
export HTTPS_PROXY=http://host.docker.internal:8080
```

### Configuration `.npmrc`

Si nécessaire, ajoutez dans `.npmrc` :
```
proxy=http://host.docker.internal:9000
https-proxy=http://host.docker.internal:9000
```

## 📦 Image de base

- **Image** : `node:22-bookworm`
- **Node.js** : Version 22 LTS (officielle)
- **Système** : Debian Bookworm
- **Package Manager** : pnpm (via corepack)
- **Git** : Installé automatiquement

## 🛠️ Fonctionnalités

### Extensions VS Code installées
- **Biome** - Linter et formatter
- **ESLint** - Support ESLint
- **TypeScript** - Support TypeScript avancé
- **Jest** - Runner de tests intégré
- **Code Spell Checker** - Vérification orthographique

### Outils Git
- **Git** - Installé automatiquement au démarrage
- **GitHub CLI** - Peut être installé manuellement si nécessaire

### Ports exposés
- **3000** - Application (avec notification auto)
- **9229** - Node.js Debug (silencieux)

## 📝 Scripts disponibles

Une fois dans le container, tous les scripts npm sont disponibles :

```bash
# Tests
pnpm test                 # Exécuter tous les tests
pnpm test:coverage        # Tests avec couverture

# Build
pnpm build                # Builder le projet
pnpm build:lib            # Builder la librairie
pnpm watch:tsup           # Mode watch

# Qualité de code
pnpm lint                 # Linter le code
pnpm lint:fix             # Corriger automatiquement
pnpm format               # Formatter le code
pnpm quality              # Vérifier qualité complète
```

## 🔄 Configuration post-création

Le container exécute automatiquement :
1. `corepack enable` - Active pnpm
2. `pnpm install` - Installe les dépendances
3. Configure Git avec votre `.gitconfig` local

## 🐛 Debug

Pour débugger avec VS Code dans le container :
1. Ajouter un breakpoint dans votre code
2. Aller dans l'onglet "Run and Debug" (Ctrl+Shift+D)
3. Sélectionner la configuration de debug Node.js
4. Le port 9229 est automatiquement exposé

## 📂 Montages

- **`.gitconfig`** - Votre configuration Git locale est montée en lecture seule
- **Workspace** - Le dossier du projet est monté automatiquement

## ⚙️ Personnalisation

Pour personnaliser le container, modifiez `.devcontainer/devcontainer.json` :

```json
{
  "customizations": {
    "vscode": {
      "extensions": ["mon-extension"],
      "settings": {
        "mon.parametre": "valeur"
      }
    }
  }
}
```

## 🚨 Troubleshooting

### Le container ne démarre pas
- Vérifier que Docker Desktop est lancé
- Vérifier les logs : `Dev Containers: Show Container Log`

### Problème de proxy
- Vérifier les variables d'environnement sur l'hôte
- **Important** : Utiliser `host.docker.internal` au lieu de `127.0.0.1` ou `localhost`
- Vérifier que le proxy écoute sur toutes les interfaces (0.0.0.0:9000) et pas seulement localhost
- Tester dans le container : `curl -v --proxy http://host.docker.internal:9000 https://www.google.com`
- Vérifier `.npmrc` si pnpm échoue
- Vérifier les variables : `echo $HTTP_PROXY` dans le terminal du container

### Problème Git
- Vérifier que `.gitconfig` existe sur l'hôte
- Exécuter manuellement : `git config --global user.name "Votre Nom"`

### Rechargement
Pour reconstruire complètement le container :
- `F1` → `Dev Containers: Rebuild Container`

## 📚 Ressources

- [Documentation Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Spec](https://containers.dev/)
- [Images disponibles](https://github.com/devcontainers/images)
