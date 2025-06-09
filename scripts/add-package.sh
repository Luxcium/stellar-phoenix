#!/bin/bash
# Package Addition Script
# Usage: ./scripts/add-package.sh [dev|prod] <package-names> [--workspace=name]
# Location: /scripts/add-package.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/detect-env.sh"

# Validate arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 [dev|prod] <package-names> [--workspace=name]"
    echo ""
    echo "Examples:"
    echo "  $0 dev @types/jest typescript"
    echo "  $0 prod express zod"
    echo "  $0 dev @types/node --workspace=backend"
    exit 1
fi

dep_type=$1
shift

# Validate dependency type
if [ "$dep_type" != "dev" ] && [ "$dep_type" != "prod" ]; then
    echo "Error: Dependency type must be 'dev' or 'prod'"
    exit 1
fi

echo "🔍 Package Manager: $(detect_package_manager)"
echo "📦 Adding $dep_type dependencies: $@"

add_dependency "$dep_type" "$@"

echo "✅ Dependencies added successfully!"
