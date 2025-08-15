#!/bin/bash

# Script pour ajouter une nouvelle application à la marketplace
# Usage: ./add-app.sh <repo_url> <app_name> <description> <version>

set -e

if [ $# -lt 4 ]; then
    echo "Usage: $0 <repo_url> <app_name> <description> <version>"
    echo "Exemple: $0 https://github.com/user/myapp_ynh myapp 'Mon application' 1.0.0"
    exit 1
fi

REPO_URL="$1"
APP_NAME="$2"
DESCRIPTION="$3"
VERSION="$4"

echo "=== Ajout de l'application $APP_NAME à la marketplace ==="

# Vérifier que l'app n'existe pas déjà
if [ -d "apps/${APP_NAME}_ynh" ]; then
    echo "❌ L'application $APP_NAME existe déjà dans apps/${APP_NAME}_ynh"
    exit 1
fi

# Cloner l'application
echo "📥 Clonage de l'application depuis $REPO_URL..."
git clone "$REPO_URL" "temp_${APP_NAME}"

# Copier dans la marketplace
echo "📁 Copie dans la marketplace..."
mkdir -p "apps/${APP_NAME}_ynh"
cp -r "temp_${APP_NAME}"/* "apps/${APP_NAME}_ynh/"

# Nettoyer le dossier git
rm -rf "apps/${APP_NAME}_ynh/.git"
rm -rf "temp_${APP_NAME}"

# Mettre à jour README.md
echo "📝 Mise à jour du README..."
sed -i "/### \[Nouvelle App\]/i\\
### $APP_NAME\\
$DESCRIPTION\\
\\
- **Version actuelle :** $VERSION\\
- **Statut :** ✅ Stable\\
- **Dépendances :** À compléter\\
\\
" README.md

# Ajouter la commande d'installation
sed -i "/# Nouvelle App/i\\
# $APP_NAME\\
yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/${APP_NAME}_ynh\\
\\
" README.md

# Mettre à jour le script de vérification
echo "🔧 Mise à jour du script de vérification..."
sed -i "s/local marketplace_apps=(\([^)]*\))/local marketplace_apps=(\1 \"$APP_NAME\")/" scripts/check-updates.sh

# Ajouter au guide d'installation
echo "📖 Mise à jour du guide d'installation..."
sed -i "/## 🚀 Installation de Liberchat/a\\
\\
## 🚀 Installation de $APP_NAME\\
\\
### Étape 1 : Installation\\
\\
\`\`\`bash\\
yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/${APP_NAME}_ynh\\
\`\`\`\\
" install-guide.md

echo "✅ Application $APP_NAME ajoutée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez les fichiers dans apps/${APP_NAME}_ynh/"
echo "2. Complétez la description et les dépendances dans README.md"
echo "3. Testez l'installation : yunohost app install apps/${APP_NAME}_ynh"
echo "4. Commitez les changements : git add . && git commit -m 'Add $APP_NAME application'"
echo "5. Poussez : git push"