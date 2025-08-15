#!/bin/bash

# Script de vérification des mises à jour LiberChat Marketplace
# Usage: ./check-updates.sh [app_name]

REPO_URL="https://api.github.com/repos/Liberchat/LiberChat-Marketplace"
NOTIFICATION_EMAIL="admin@votre-domaine.tld"
LOG_FILE="/var/log/liberchat-updates.log"

# Fonction de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Fonction d'envoi de notification
send_notification() {
    local app_name="$1"
    local new_version="$2"
    local current_version="$3"
    
    if command -v mail >/dev/null 2>&1; then
        {
            echo "Une nouvelle version de $app_name est disponible !"
            echo ""
            echo "Version actuelle : $current_version"
            echo "Nouvelle version : $new_version"
            echo ""
            echo "Pour mettre à jour :"
            echo "yunohost app upgrade $app_name -u https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/${app_name}_ynh"
            echo ""
            echo "Consultez les notes de version :"
            echo "https://github.com/Liberchat/LiberChat-Marketplace/releases"
        } | mail -s "Mise à jour disponible : $app_name v$new_version" "$NOTIFICATION_EMAIL"
    fi
}

# Fonction de vérification d'une app
check_app_update() {
    local app_name="$1"
    
    log "Vérification des mises à jour pour $app_name..."
    
    # Vérifier si l'app est installée
    if ! yunohost app list --output-as json | jq -r '.[].id' | grep -q "^$app_name$"; then
        log "L'application $app_name n'est pas installée"
        return 1
    fi
    
    # Récupérer la version actuelle
    local current_version=$(yunohost app info "$app_name" --output-as json | jq -r '.version' | cut -d'~' -f1)
    
    # Récupérer la dernière version depuis GitHub
    local latest_release=$(curl -s "$REPO_URL/releases/latest" | jq -r '.tag_name' 2>/dev/null)
    
    if [ -z "$latest_release" ] || [ "$latest_release" = "null" ]; then
        log "Impossible de récupérer la dernière version depuis GitHub"
        return 1
    fi
    
    # Comparer les versions
    if [ "$current_version" != "$latest_release" ]; then
        log "Nouvelle version disponible pour $app_name : $current_version -> $latest_release"
        send_notification "$app_name" "$latest_release" "$current_version"
        return 0
    else
        log "$app_name est à jour (version $current_version)"
        return 1
    fi
}

# Fonction principale
main() {
    log "Démarrage de la vérification des mises à jour"
    
    # Si un nom d'app est fourni, vérifier seulement cette app
    if [ -n "$1" ]; then
        check_app_update "$1"
        exit $?
    fi
    
    # Sinon, vérifier toutes les apps de la marketplace
    local apps_updated=0
    
    # Liste des applications de la marketplace
    local marketplace_apps=("liberchat")
    
    for app in "${marketplace_apps[@]}"; do
        if check_app_update "$app"; then
            ((apps_updated++))
        fi
    done
    
    if [ $apps_updated -eq 0 ]; then
        log "Toutes les applications sont à jour"
    else
        log "$apps_updated application(s) peuvent être mises à jour"
    fi
    
    log "Vérification terminée"
}

# Vérifier les prérequis
if ! command -v jq >/dev/null 2>&1; then
    echo "Erreur : jq n'est pas installé. Installez-le avec : sudo apt install jq"
    exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
    echo "Erreur : curl n'est pas installé. Installez-le avec : sudo apt install curl"
    exit 1
fi

# Créer le fichier de log s'il n'existe pas
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

# Exécuter le script principal
main "$@"