#!/bin/bash
# Initial Development Environment Setup
# Run this on fresh clone or when setting up new workspace
# Location: /scripts/setup-dev-env.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/detect-env.sh"

echo "🚀 Stellar Phoenix - Development Environment Setup"
echo "=================================================="

echo "🔍 Detecting package manager..."
PM=$(detect_package_manager)
echo "📦 Using: $PM"

echo "🧹 Cleaning previous installations..."
rm -rf node_modules
find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "📥 Installing root dependencies..."
install_dependencies

echo "🔧 Setting up workspace packages..."
case $PM in
    "pnpm")
        echo "Installing all workspace dependencies..."
        pnpm install --recursive
        ;;
    "yarn")
        echo "Installing workspace dependencies..."
        yarn install
        ;;
    "npm")
        echo "Installing workspace dependencies..."
        npm run install-workspaces 2>/dev/null || echo "No workspace install script found"
        ;;
esac

echo ""
echo "✅ Development environment ready!"
echo "📋 Available scripts:"
echo "  - Run all tests: $PM test"
echo "  - Build project: $PM build"  
echo "  - Start development: $PM dev"
echo "  - Add dependency: ./scripts/add-package.sh [dev|prod] <package-names>"
echo ""
echo "💡 Tips:"
echo "  - Use './scripts/add-package.sh' to add dependencies"
echo "  - Never manually edit version numbers in package.json"
echo "  - Run this script after pulling major changes"
