# Dev Container for FFS2 Logger

This project uses a Dev Container to provide a consistent development environment.

## 🚀 Quick Start

1. **Install Prerequisites**:
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - [VS Code](https://code.visualstudio.com/)
   - VS Code Extension: [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Open in Container**:
   - Open VS Code in the project folder
   - Press `F1` and select: `Dev Containers: Reopen in Container`
   - Or click the `><` icon at the bottom left and choose "Reopen in Container"

3. **First Use**:
   The container will:
   - Download the Node.js 20 image
   - Install dependencies with `pnpm install`
   - Configure Git

## 🔧 Proxy Configuration

The Dev Container automatically supports HTTP/HTTPS proxies.

### Environment Variables

The following variables are configured to point to the host:
- `HTTP_PROXY`: `http://host.docker.internal:9000`
- `HTTPS_PROXY`: `http://host.docker.internal:9000`
- `NO_PROXY`: `localhost,127.0.0.1,host.docker.internal`

**Note**: The configuration intentionally ignores your local environment variables (which often contain `127.0.0.1`) to force the use of `host.docker.internal`, the only way for the container to reach the proxy on the host.

### Customization

To modify the proxy port or address, you must directly edit the `.devcontainer/devcontainer.json` file.

### `.npmrc` Configuration

If necessary, add to `.npmrc`:
```
proxy=http://host.docker.internal:9000
https-proxy=http://host.docker.internal:9000
```

## 📦 Base Image

- **Image**: `node:22-bookworm`
- **Node.js**: Version 22 LTS (official)
- **System**: Debian Bookworm
- **Package Manager**: pnpm (via corepack)
- **Git**: Automatically installed

## 🛠️ Features

### Installed VS Code Extensions
- **Biome** - Linter and formatter
- **ESLint** - ESLint support
- **TypeScript** - Advanced TypeScript support
- **Jest** - Integrated test runner
- **Code Spell Checker** - Spell checking

### Git Tools
- **Git** - Automatically installed at startup
- **GitHub CLI** - Can be manually installed if needed

### Exposed Ports
- **3000** - Application (with auto notification)
- **9229** - Node.js Debug (silent)

## 📝 Available Scripts

Once in the container, all npm scripts are available:

```bash
# Tests
pnpm test                 # Run all tests
pnpm test:coverage        # Tests with coverage

# Build
pnpm build                # Build the project
pnpm build:lib            # Build the library
pnpm watch:tsup           # Watch mode

# Code Quality
pnpm lint                 # Lint the code
pnpm lint:fix             # Automatically fix linting issues
pnpm format               # Format the code
pnpm quality              # Check full quality
```

## 🔄 Post-Creation Configuration

The container automatically executes:
1. `corepack enable` - Enables pnpm
2. `pnpm install` - Installs dependencies
3. Configures Git with your local `.gitconfig`

## 🐛 Debug

To debug with VS Code in the container:
1. Add a breakpoint in your code
2. Go to the "Run and Debug" tab (Ctrl+Shift+D)
3. Select the Node.js debug configuration
4. Port 9229 is automatically exposed

## 📂 Mounts

- **`.gitconfig`** - Your local Git configuration is mounted read-only
- **Workspace** - The project folder is mounted automatically

## ⚙️ Customization

To customize the container, modify `.devcontainer/devcontainer.json`:

```json
{
  "customizations": {
    "vscode": {
      "extensions": ["my-extension"],
      "settings": {
        "my.setting": "value"
      }
    }
  }
}
```

## 🚨 Troubleshooting

### The container does not start
- Check that Docker Desktop is running
- Check the logs: `Dev Containers: Show Container Log`

### Proxy Issue
- Check environment variables on the host
- **Important**: Use `host.docker.internal` instead of `127.0.0.1` or `localhost`
- Check that the proxy listens on all interfaces (0.0.0.0:9000) and not just localhost
- Test in the container: `curl -v --proxy http://host.docker.internal:9000 https://www.google.com`
- Check `.npmrc` if pnpm fails
- Check variables: `echo $HTTP_PROXY` in the container terminal

### Git Issue
- Check that `.gitconfig` exists on the host
- Manually execute: `git config --global user.name "Your Name"`

### Reloading
To completely rebuild the container:
- `F1` → `Dev Containers: Rebuild Container`

## 📚 Resources

- [Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Spec](https://containers.dev/)
- [Available Images](https://github.com/devcontainers/images)
