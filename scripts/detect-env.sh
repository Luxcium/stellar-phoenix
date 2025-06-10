#!/bin/bash
# Environment Detection and Package Manager Utilities
# Location: /scripts/detect-env.sh

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
    echo "Installing dependencies using $pm..."
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
    local workspace=""
    local packages=()
    
    # Parse arguments
    shift
    while [[ $# -gt 0 ]]; do
        case $1 in
            --workspace=*)
                workspace="${1#*=}"
                shift
                ;;
            -w)
                workspace="$2"
                shift 2
                ;;
            *)
                packages+=("$1")
                shift
                ;;
        esac
    done
    
    echo "Adding ${packages[@]} as $dep_type dependencies using $pm..."
    
    if [ -n "$workspace" ]; then
        echo "Target workspace: $workspace"
        cd "$workspace" || exit 1
    fi
    
    case $pm in
        "pnpm")
            if [ "$dep_type" = "dev" ]; then
                if [ -n "$workspace" ]; then
                    cd .. && pnpm add -D "${packages[@]}" --filter "$workspace"
                else
                    pnpm add -D "${packages[@]}" -w
                fi
            else
                if [ -n "$workspace" ]; then
                    cd .. && pnpm add "${packages[@]}" --filter "$workspace"
                else
                    pnpm add "${packages[@]}" -w
                fi
            fi
            ;;
        "yarn")
            if [ "$dep_type" = "dev" ]; then
                yarn add --dev "${packages[@]}"
            else
                yarn add "${packages[@]}"
            fi
            ;;
        "npm")
            if [ "$dep_type" = "dev" ]; then
                npm install --save-dev "${packages[@]}"
            else
                npm install --save "${packages[@]}"
            fi
            ;;
    esac
}

# Export functions for use in other scripts
export -f detect_package_manager
export -f install_dependencies
export -f add_dependency
