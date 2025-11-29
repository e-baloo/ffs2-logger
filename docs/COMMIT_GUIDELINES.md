# Conventional Commits

This project uses **Conventional Commits** to maintain a clean Git history and automatically generate changelogs.

## Commit Format

Your commit messages must follow this format:

```
<type>: <description>

[optional body]

[optional footer]
```

### Allowed Types:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Formatting, missing semi-colons, etc.
- **refactor**: Code refactoring
- **test**: Adding missing tests
- **chore**: Maintenance (build, tools, etc.)
- **perf**: Performance improvements
- **ci**: CI changes
- **build**: Build system changes
- **revert**: Revert a previous commit

### Valid Examples:

```bash
feat: Add JSON logging support
fix: Resolve memory leak in DI container
docs: Update README with installation guide
refactor: Simplify console appender logic
test: Add unit tests for logger factory
chore: Update dependencies to latest versions
```

### Invalid Examples:

```bash
# ❌ No type
Add new feature

# ❌ Incorrect type
feature: Add new functionality

# ❌ No description
feat:

# ❌ Description too long (>72 characters)
feat: This is a very long description that exceeds the maximum allowed length
```

## Automatic Validation

Commits are automatically validated by `commitlint` via a Git hook. If your message does not respect the format, the commit will be rejected.

## Active Git Hooks

- **pre-commit**: Checks code quality (lint + format + build)
- **commit-msg**: Validates commit message format
- **pre-push**: Runs all tests

## Bypass (Emergency Only)

⚠️ **Not Recommended** - In case of absolute emergency:

```bash
git commit --no-verify -m "emergency fix"
```