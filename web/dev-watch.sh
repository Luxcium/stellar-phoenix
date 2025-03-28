#!/bin/bash

# Function to print colored output
print_colored() {
  echo -e "\033[1;36m$1\033[0m"
}

# Function to handle script termination
cleanup() {
  print_colored "\nShutting down development servers..."
  # Kill any background processes started by this script
  kill $(jobs -p) 2>/dev/null
  print_colored "Development environment shut down gracefully."
  exit 0
}

# Set up trap to handle Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Print welcome message
print_colored "=========================================="
print_colored "NEXO OWL PROJECT - DEVELOPMENT WATCH MODE"
print_colored "=========================================="

# Update Memory Bank
echo "## $(date)" >> memory-bank/progress.md
echo "- Development watch mode started" >> memory-bank/progress.md

# Check for dependencies
if ! command -v concurrently &> /dev/null || ! command -v nodemon &> /dev/null; then
  print_colored "Installing required dependencies..."
  npm install --save-dev concurrently nodemon
fi

# Start memory bank monitoring in background
print_colored "Starting Memory Bank monitor..."
(while true; do
  clear
  echo -e "\033[1;33m=== MEMORY BANK MONITOR ===\033[0m"
  echo -e "\033[1;33mLast updated: $(date)\033[0m\n"
  cat memory-bank/activeContext.md
  sleep 10
done) &
MONITOR_PID=$!

print_colored "\nChoose development mode:"
print_colored "1) TypeScript watch + Node.js (npm run watch)"
print_colored "2) Next.js development server with watch (npm run dev:watch)"
print_colored "3) Full monitoring setup (Next.js + TypeScript watch)"

read -p "Enter your choice (1-3, default: 3): " mode_choice

# Default to full monitoring if no choice is made
if [ -z "$mode_choice" ]; then
  mode_choice=3
fi

# Execute based on choice
case $mode_choice in
  1)
    print_colored "Starting TypeScript watch + Node.js..."
    npm run watch
    ;;
  2)
    print_colored "Starting Next.js development server with watch..."
    npm run dev:watch
    ;;
  3)
    print_colored "Starting full monitoring setup..."
    # Create a named pipe for logs
    PIPE=$(mktemp -u)
    mkfifo $PIPE
    
    # Start both development processes and combine their outputs
    npm run dev:watch > >(sed 's/^/[Next.js] /' > $PIPE) &
    npm run watch > >(sed 's/^/[TS+Node] /' > $PIPE) &
    
    # Read from the pipe and display logs
    cat $PIPE
    
    # Clean up the pipe when done
    rm -f $PIPE
    ;;
  *)
    print_colored "Invalid choice. Starting full monitoring setup (default)..."
    npm run dev:watch & npm run watch
    ;;
esac

# Wait for all background processes to finish
wait