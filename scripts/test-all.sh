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

# Color definitions
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to run tests with a header
run_tests() {
  local title="$1"
  local command="$2"
  local dir="$3"
  
  echo -e "\n${GREEN}Running $title tests...${NC}"
  cd "$dir"
  eval "$command"
  cd - > /dev/null
  echo -e "${GREEN}✓ $title tests passed${NC}"
}

# Ensure dependencies are installed
echo "📦 Checking dependencies..."
pnpm install

# Test TypeScript
echo -e "\n${GREEN}Testing TypeScript...${NC}"
pnpm test

# Test Python code
echo -e "\n${GREEN}Testing Python code...${NC}"
cd backend/python
if [ ! -d ".venv" ]; then
  python -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
else
  source .venv/bin/activate
fi
python -m pytest --cov=src --cov-report=html
cd ../../

# Generate and display coverage report
echo -e "\n${GREEN}Generating coverage reports...${NC}"
pnpm coverage

echo -e "\n${GREEN}All tests completed successfully! 🎉${NC}"
echo "Coverage reports available in:"
echo "  - TypeScript: /coverage"
echo "  - Python: /python/htmlcov"
