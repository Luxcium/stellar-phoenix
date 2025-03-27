#!/bin/bash
set -e

# Function to handle errors
handle_error() {
  echo "Error: An error occurred in the script at line $1"
  exit 1
}

# Set up error handling
trap 'handle_error $LINENO' ERR

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
fi

echo "🏗️  Building all applications..."

# Build TypeScript
echo "📦 Building TypeScript..."
pnpm build

# Build Python package if needed
echo "🐍 Building Python package..."
cd python
if [ ! -d ".venv" ]; then
  python -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
else
  source .venv/bin/activate
fi
pip install --upgrade build
python -m build
cd ..

echo "✨ Build complete! Summary:"
echo "  - TypeScript: /dist"
echo "  - Python package: /python/dist"
