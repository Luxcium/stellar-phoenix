#!/usr/bin/env bash
# Minimal Genesis Boot-Phase Script
# Location: /scripts/genesis.sh
# Performs initial environment checks and setup

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/detect-env.sh"

# Step 1: Check for node_modules folder
if [ -d "node_modules" ]; then
    echo "node_modules present"
else
    echo "node_modules missing, detecting package manager..."
    PM=$(detect_package_manager)
    echo "Using $PM for installation"
    case $PM in
        pnpm)
            if [ -f "pnpm-workspace.yaml" ]; then
                pnpm install --recursive
            else
                pnpm install
            fi
            ;;
        yarn)
            yarn install
            ;;
        npm)
            npm install
            ;;
    esac
fi

# Step 3: Verify installation
if [ -d "node_modules" ]; then
    echo "Dependencies installed"
else
    echo "Dependency installation failed" >&2
fi

# Step 4: Detect container environment
if [ -f "/.dockerenv" ] || [ "${CI:-}" = "true" ]; then
    echo "Running inside container"
else
    echo "Running outside container"
fi

# Step 5: Validate Git repository
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Git repository detected"
    git status --short
    echo "Current branch: $(git rev-parse --abbrev-ref HEAD)"
else
    echo "Not a git repository"
fi
