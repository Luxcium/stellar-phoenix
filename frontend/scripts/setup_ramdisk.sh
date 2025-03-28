#!/bin/bash

# Script pour configurer un RAM Disk (tmpfs) pour les opérations temporaires
# Ce script améliore les performances en évitant les accès disque pour les fichiers temporaires

# Configuration
RAMDISK_SIZE="1G"  # Taille du RAM Disk
RAMDISK_PATH="/tmp/ramdisk"  # Chemin du RAM Disk

# Fonction pour afficher les messages avec couleur
function echo_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

function echo_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

function echo_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# Vérifier si l'utilisateur a les privilèges root
if [ "$EUID" -ne 0 ]; then
    echo_error "Ce script nécessite des privilèges root. Exécutez-le avec sudo."
    exit 1
fi

# Créer le répertoire pour le RAM Disk s'il n'existe pas
if [ ! -d "$RAMDISK_PATH" ]; then
    echo_info "Création du répertoire pour le RAM Disk: $RAMDISK_PATH"
    mkdir -p "$RAMDISK_PATH"
fi

# Vérifier si le RAM Disk est déjà monté
if grep -q "$RAMDISK_PATH" /proc/mounts; then
    echo_info "Un RAM Disk est déjà monté sur $RAMDISK_PATH"
    echo_info "État actuel du RAM Disk:"
    df -h "$RAMDISK_PATH"
    
    read -p "Voulez-vous redimensionner ou remplacer le RAM Disk existant? (o/n): " response
    if [[ "$response" =~ ^[Oo]$ ]]; then
        echo_info "Démontage du RAM Disk existant..."
        umount "$RAMDISK_PATH"
    else
        echo_info "Conservation du RAM Disk existant"
        exit 0
    fi
fi

# Monter le RAM Disk
echo_info "Montage du RAM Disk ($RAMDISK_SIZE) sur $RAMDISK_PATH"
mount -t tmpfs -o size="$RAMDISK_SIZE" tmpfs "$RAMDISK_PATH"

# Vérifier si le montage a réussi
if [ $? -eq 0 ]; then
    echo_success "RAM Disk monté avec succès sur $RAMDISK_PATH"
    echo_info "État du RAM Disk:"
    df -h "$RAMDISK_PATH"
    
    # Définir les permissions appropriées
    chmod 777 "$RAMDISK_PATH"
    echo_info "Permissions définies sur le RAM Disk (777)"
    
    # Exporter la variable d'environnement pour une utilisation facile dans les scripts
    echo "export RAMDISK_PATH=\"$RAMDISK_PATH\"" > /tmp/ramdisk_env.sh
    echo_info "Variable d'environnement RAMDISK_PATH exportée dans /tmp/ramdisk_env.sh"
    echo_info "Pour l'utiliser: source /tmp/ramdisk_env.sh"
else
    echo_error "Échec du montage du RAM Disk"
    exit 1
fi

echo_info "Pour utiliser le RAM Disk dans vos applications, référencez le chemin: $RAMDISK_PATH"
echo_info "Pour démontér le RAM Disk: sudo umount $RAMDISK_PATH"