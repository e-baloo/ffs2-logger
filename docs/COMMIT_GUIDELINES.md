# Conventional Commits

Ce projet utilise les **Conventional Commits** pour maintenir un historique Git propre et générer automatiquement des changelogs.

## Format des commits

Vos messages de commit doivent suivre ce format :

```
<type>: <description>

[body optionnel]

[footer optionnel]
```

### Types autorisés :

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Documentation
- **style**: Formatage, points-virgules manquants, etc.
- **refactor**: Refactoring du code
- **test**: Ajout de tests manquants
- **chore**: Maintenance (build, outils, etc.)
- **perf**: Amélioration des performances
- **ci**: Changements dans la CI
- **build**: Changements qui affectent le système de build
- **revert**: Retour en arrière

### Exemples valides :

```bash
feat: Add JSON logging support
fix: Resolve memory leak in DI container
docs: Update README with installation guide
refactor: Simplify console appender logic
test: Add unit tests for logger factory
chore: Update dependencies to latest versions
```

### Exemples invalides :

```bash
# ❌ Pas de type
Add new feature

# ❌ Type incorrect
feature: Add new functionality

# ❌ Pas de description
feat:

# ❌ Description trop longue (>72 caractères)
feat: This is a very long description that exceeds the maximum allowed length
```

## Validation automatique

Les commits sont automatiquement validés par `commitlint` via un hook Git. Si votre message ne respecte pas le format, le commit sera rejeté.

## Hooks Git actifs

- **pre-commit**: Vérifie la qualité du code (lint + format + build)
- **commit-msg**: Valide le format du message de commit
- **pre-push**: Exécute tous les tests

## Bypass (en cas d'urgence)

⚠️ **Non recommandé** - En cas d'urgence absolue :

```bash
git commit --no-verify -m "emergency fix"
```