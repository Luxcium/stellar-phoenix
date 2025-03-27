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

# Ensure all dependencies are installed
echo "📦 Installing dependencies..."
pnpm install

# Start PostgreSQL if not running
if ! docker ps | grep -q postgres; then
  echo "🐘 Starting PostgreSQL..."
  docker compose up -d postgres
fi

# Start Python service
echo "🐍 Starting Python service..."
cd python && \
  python -m venv .venv && \
  source .venv/bin/activate && \
  pip install -r requirements.txt && \
  python src/main.py &
cd ..

# Build and watch TypeScript
echo "📦 Starting TypeScript build watch..."
pnpm watch &

# Wait for all background processes
wait

# Cleanup on script exit
cleanup() {
  echo "Cleaning up processes..."
  jobs -p | xargs -r kill
}

trap cleanup EXIT

echo "🚀 Development environment is ready!"
echo "📝 Available services:"
echo "  - TypeScript: Watching for changes"
echo "  - Python Service: Running"
echo "  - PostgreSQL: localhost:5432"
