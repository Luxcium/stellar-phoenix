# Development Environment Setup Guidelines

## Core Principles

### Package Management Detection & Usage

- **NEVER** hardcode versions in package.json manually
- **ALWAYS** use package manager commands to install/update dependencies
- **ALWAYS** detect the package manager type before operations
- **ALWAYS** maintain lockfiles consistency

### Package Manager Priority

1. **PNPM** (preferred for monorepos) - uses `pnpm-lock.yaml`
2. **Yarn** - uses `yarn.lock`
3. **NPM** - uses `package-lock.json`

## Environment Detection Script

Location: `/scripts/detect-env.sh`

```bash
#!/bin/bash
# Environment Detection and Setup Script

detect_package_manager() {
    if [ -f "pnpm-lock.yaml" ] || [ -f "pnpm-workspace.yaml" ]; then
        echo "pnpm"
    elif [ -f "yarn.lock" ]; then
        echo "yarn"
    elif [ -f "package-lock.json" ]; then
        echo "npm"
    else
        echo "npm" # default fallback
    fi
}

install_dependencies() {
    local pm=$(detect_package_manager)
    case $pm in
        "pnpm")
            pnpm install
            ;;
        "yarn")
            yarn install
            ;;
        "npm")
            npm install
            ;;
    esac
}

add_dependency() {
    local pm=$(detect_package_manager)
    local dep_type=$1
    local packages=${@:2}

    case $pm in
        "pnpm")
            if [ "$dep_type" = "dev" ]; then
                pnpm add -D $packages
            else
                pnpm add $packages
            fi
            ;;
        "yarn")
            if [ "$dep_type" = "dev" ]; then
                yarn add --dev $packages
            else
                yarn add $packages
            fi
            ;;
        "npm")
            if [ "$dep_type" = "dev" ]; then
                npm install --save-dev $packages
            else
                npm install --save $packages
            fi
            ;;
    esac
}
```

## Initial Development Environment Setup

Location: `/scripts/setup-dev-env.sh`

```bash
#!/bin/bash
# Initial Development Environment Setup
# Run this on fresh clone or when setting up new workspace

set -e

source "$(dirname "$0")/detect-env.sh"

echo "🔍 Detecting package manager..."
PM=$(detect_package_manager)
echo "📦 Using: $PM"

echo "🧹 Cleaning previous installations..."
rm -rf node_modules
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

echo "📥 Installing root dependencies..."
install_dependencies

echo "🔧 Setting up workspace packages..."
case $PM in
    "pnpm")
        pnpm install --recursive
        ;;
    "yarn")
        yarn install
        ;;
    "npm")
        npm run install-workspaces 2>/dev/null || npm install
        ;;
esac

echo "✅ Development environment ready!"
echo "📋 Available scripts:"
echo "  - Run all tests: $PM test"
echo "  - Build project: $PM build"
echo "  - Start development: $PM dev"
```

## Package Addition Guidelines

### For Root Workspace

```bash
# CORRECT - Let package manager handle versions
./scripts/add-package.sh dev @types/jest typescript
./scripts/add-package.sh prod express zod

# WRONG - Never edit package.json manually with versions
```

### For Workspace Packages

```bash
# CORRECT - Add to specific workspace
./scripts/add-package.sh dev @types/node --workspace=backend
./scripts/add-package.sh prod @prisma/client --workspace=backend

# Use workspace-specific commands
cd backend && pnpm add @types/node
```

## Memory Bank Integration

This file should be referenced for:

- Setting up fresh clones
- Adding new dependencies
- Workspace configuration
- Package manager consistency
- Version management

## Quick Reference Commands

### Environment Setup

```bash
# Fresh setup
./scripts/setup-dev-env.sh

# Add dependency (auto-detects PM)
./scripts/add-package.sh [dev|prod] <package-names>

# Workspace-specific
./scripts/add-package.sh dev @types/jest --workspace=backend
```

### Common Operations

```bash
# Install all dependencies
$(detect_package_manager) install

# Add dev dependency
$(detect_package_manager) add -D @types/jest  # pnpm
# OR
$(detect_package_manager) add --dev @types/jest  # yarn
# OR
$(detect_package_manager) install --save-dev @types/jest  # npm
```

## Best Practices

1. **Always run setup script on fresh clone**
2. **Never manually edit version numbers in package.json**
3. **Use package manager commands for all dependency operations**
4. **Maintain lockfile consistency across team**
5. **Test setup script regularly to ensure it works**
6. **Document any special setup requirements**

## Troubleshooting

### Version Conflicts

- Delete node_modules and lockfiles
- Run setup script
- Re-add packages using commands

### Package Manager Mismatch

- Check for multiple lockfiles
- Remove incorrect lockfiles
- Use single package manager consistently

## Genesis Boot Phase

This minimal script ensures a consistent starting environment:

1. Check for a `node_modules` folder.
2. If missing, detect the package manager:
   - `pnpm-lock.yaml` → pnpm
   - `package-lock.json` or `npm-shrinkwrap.json` → npm
   - `yarn.lock` → yarn
   - When pnpm and `pnpm-workspace.yaml` are present, install with workspace support.
3. Install dependencies via the detected manager.
4. Verify `node_modules` exists and report success or failure.
5. Detect container environment via `/.dockerenv` or `CI=true`.
6. Validate the Git repository with `git rev-parse --is-inside-work-tree` and log status.

Script location: `/scripts/genesis.sh`.
