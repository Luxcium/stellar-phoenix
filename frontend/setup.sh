#!/bin/bash

# Function to print colored output
print_colored() {
  echo -e "\033[1;34m$1\033[0m"
}

# Function to check Memory Bank
check_memory_bank() {
  print_colored "Checking Memory Bank for context..."
  cat memory-bank/activeContext.md
}

# Function to update documentation
update_docs() {
  print_colored "Updating documentation..."
  echo "## $(date)" >> memory-bank/progress.md
  echo "- Setup script executed with mode: $1" >> memory-bank/progress.md
}

# Function to verify project state
verify_changes() {
  print_colored "Verifying project state..."
  npm audit
}

# Function to install dependencies
install_dependencies() {
  print_colored "Installing/updating dependencies..."
  npm install
}

# Print welcome message
print_colored "==========================================="
print_colored "NEXO OWL PROJECT - DEVELOPMENT SETUP SCRIPT"
print_colored "==========================================="
print_colored "This script will set up the development environment for the project."

# Check Memory Bank for context
check_memory_bank

# Install dependencies
install_dependencies

# Update documentation with initial setup
update_docs "setup"

# Verify project state
verify_changes

# Ask for development mode
print_colored "\nChoose development mode:"
print_colored "1) Regular mode (npm start)"
print_colored "2) Watch mode (npm run watch)"
print_colored "3) Next.js development server (npm run dev)"
print_colored "4) Next.js development server with watch (npm run dev:watch)"

read -p "Enter your choice (1-4, default: 2): " mode_choice

# Default to watch mode if no choice is made
if [ -z "$mode_choice" ]; then
  mode_choice=2
fi

# Execute based on choice
case $mode_choice in
  1)
    print_colored "Starting in regular mode..."
    update_docs "regular"
    npm start
    ;;
  2)
    print_colored "Starting in watch mode..."
    update_docs "watch"
    npm run watch
    ;;
  3)
    print_colored "Starting Next.js development server..."
    update_docs "Next.js dev"
    npm run dev
    ;;
  4)
    print_colored "Starting Next.js development server with watch..."
    update_docs "Next.js dev:watch"
    npm run dev:watch
    ;;
  *)
    print_colored "Invalid choice. Starting in watch mode (default)..."
    update_docs "watch (default)"
    npm run watch
    ;;
esac

print_colored "Setup complete. Project is in a stable state."
