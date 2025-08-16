#!/bin/bash

# Script pour synchroniser le site vitrine avec les applications de la marketplace
# Usage: ./scripts/sync-website.sh

set -e

echo "🔄 Synchronisation du site vitrine avec la marketplace..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -d "apps" ] || [ ! -d "docs" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du dépôt"
    exit 1
fi

# Créer le répertoire temporaire
mkdir -p temp_sync
cd temp_sync

echo "📊 Analyse des applications..."

# Initialiser les données
apps_data="["
app_count=0
app_cards=""
js_commands="const appCommands = {"
js_names="const appNames = {"

# Mapping des icônes
declare -A app_icons=(
    ["liberchat"]="💬"
    ["contact-cnt-ait"]="📇"
    ["nextcloud"]="☁️"
    ["wordpress"]="📝"
    ["matrix"]="💬"
    ["mastodon"]="🐘"
    ["peertube"]="📺"
    ["gitea"]="🦊"
    ["jellyfin"]="🎬"
    ["bitwarden"]="🔐"
    ["default"]="📱"
)

# Scanner chaque application
for app_dir in ../apps/*/; do
    if [ -d "$app_dir" ]; then
        app_name=$(basename "$app_dir" _ynh)
        echo "  📱 Traitement de: $app_name"
        
        # Lire le manifest
        if [ -f "$app_dir/manifest.toml" ]; then
            manifest_file="$app_dir/manifest.toml"
            
            # Extraire les informations avec Python
            app_info=$(python3 << EOF
import tomllib
import json

try:
    with open('$manifest_file', 'rb') as f:
        data = tomllib.load(f)
    
    app_data = {
        'id': data.get('id', '$app_name'),
        'name': data.get('name', '$app_name'),
        'version': data.get('version', '1.0.0'),
        'description_fr': data.get('description', {}).get('fr', ''),
        'description_en': data.get('description', {}).get('en', ''),
        'license': data.get('upstream', {}).get('license', 'Unknown'),
        'website': data.get('upstream', {}).get('website', ''),
        'multi_instance': data.get('integration', {}).get('multi_instance', False),
        'ram_runtime': data.get('integration', {}).get('ram', {}).get('runtime', '50M'),
        'disk': data.get('integration', {}).get('disk', '50M')
    }
    
    print(json.dumps(app_data))
except Exception as e:
    print('{"error": "Failed to parse manifest"}')
EOF
)
            
            if echo "$app_info" | grep -q '"error"'; then
                echo "    ⚠️ Erreur lors de la lecture du manifest"
                continue
            fi
            
            # Extraire les données JSON
            app_id=$(echo "$app_info" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
            app_display_name=$(echo "$app_info" | python3 -c "import sys, json; print(json.load(sys.stdin)['name'])")
            version=$(echo "$app_info" | python3 -c "import sys, json; print(json.load(sys.stdin)['version'].split('~')[0])")
            description=$(echo "$app_info" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['description_fr'] or data['description_en'] or 'Application YunoHost')")
            license=$(echo "$app_info" | python3 -c "import sys, json; print(json.load(sys.stdin)['license'])")
            multi_instance=$(echo "$app_info" | python3 -c "import sys, json; print(json.load(sys.stdin)['multi_instance'])")
            
            # Choisir l'icône
            icon="${app_icons[$app_id]:-${app_icons[default]}}"
            
            # Déterminer le statut
            status_class="status-stable"
            status_text="Stable"
            
            if [[ "$version" =~ (beta|rc) ]]; then
                status_class="status-beta"
                status_text="Beta"
            elif [[ "$version" =~ (alpha|dev) ]]; then
                status_class="status-experimental"
                status_text="Expérimental"
            fi
            
            # Générer les fonctionnalités
            features=""
            if [ "$multi_instance" = "True" ]; then
                features="$features<span class=\"feature\">🔄 Multi-instance</span>"
            fi
            if [ "$license" != "Unknown" ]; then
                features="$features<span class=\"feature\">📄 $license</span>"
            fi
            features="$features<span class=\"feature\">⚡ Léger</span>"
            
            # Générer la carte HTML
            app_card="
                <!-- $app_display_name App -->
                <div class=\"app-card\">
                    <div class=\"app-header\">
                        <div class=\"app-icon\">$icon</div>
                        <div class=\"app-info\">
                            <h3 class=\"app-name\">$app_display_name</h3>
                            <span class=\"app-version\">v$version</span>
                        </div>
                        <span class=\"app-status $status_class\">$status_text</span>
                    </div>
                    <p class=\"app-description\">
                        $description
                    </p>
                    <div class=\"app-features\">
                        $features
                    </div>
                    <div class=\"app-actions\">
                        <button class=\"btn btn-primary btn-install\" data-app=\"$app_id\">
                            <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                                <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/>
                                <polyline points=\"7,10 12,15 17,10\"/>
                                <line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"/>
                            </svg>
                            Installer
                        </button>
                        <a href=\"https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/${app_id}_ynh\" class=\"btn btn-outline\" target=\"_blank\">
                            Voir le code
                        </a>
                    </div>
                </div>"
            
            app_cards="$app_cards$app_card"
            
            # Ajouter aux données JavaScript
            if [ $app_count -gt 0 ]; then
                js_commands="$js_commands,"
                js_names="$js_names,"
            fi
            
            js_commands="$js_commands
    '$app_id': 'yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/${app_id}_ynh'"
            
            js_names="$js_names
    '$app_id': '$app_display_name'"
            
            ((app_count++))
        fi
    fi
done

js_commands="$js_commands
};"

js_names="$js_names
};"

echo "✅ Trouvé $app_count applications"

# Mettre à jour index.html
echo "📝 Mise à jour de index.html..."

python3 << EOF
import re

# Lire le HTML actuel
with open('../docs/index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Nouvelles cartes d'applications
new_cards = '''$app_cards'''

# Remplacer la section apps-grid
pattern = r'(<div class="apps-grid">)(.*?)(</div>\s*</div>\s*</section>)'
replacement = r'\1' + new_cards + r'\3'

updated_html = re.sub(pattern, replacement, html_content, flags=re.DOTALL)

# Mettre à jour le compteur d'applications
updated_html = re.sub(
    r'<div class="stat-number">\d+</div>\s*<div class="stat-label">Applications disponibles</div>',
    f'<div class="stat-number">$app_count</div>\\n                    <div class="stat-label">Applications disponibles</div>',
    updated_html
)

# Écrire le HTML mis à jour
with open('../docs/index.html', 'w', encoding='utf-8') as f:
    f.write(updated_html)

print("✅ index.html mis à jour")
EOF

# Mettre à jour script.js
echo "🔧 Mise à jour de script.js..."

python3 << EOF
import re

# Lire le JavaScript actuel
with open('../docs/script.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Nouvelles données d'applications
new_commands = '''$js_commands'''
new_names = '''$js_names'''

# Remplacer les données d'applications
pattern = r'const appCommands = \{[^}]*\};'
js_content = re.sub(pattern, new_commands, js_content, flags=re.DOTALL)

pattern = r'const appNames = \{[^}]*\};'
js_content = re.sub(pattern, new_names, js_content, flags=re.DOTALL)

# Écrire le JavaScript mis à jour
with open('../docs/script.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("✅ script.js mis à jour")
EOF

# Nettoyer
cd ..
rm -rf temp_sync

echo ""
echo "🎉 Synchronisation terminée !"
echo "📊 $app_count applications synchronisées"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez les changements : git diff docs/"
echo "2. Commitez si tout est correct : git add docs/ && git commit -m 'Update website'"
echo "3. Poussez : git push"
echo ""
echo "🌐 Le site sera automatiquement redéployé après le push"