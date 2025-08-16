#!/bin/bash

# Script de validation locale d'une application YunoHost
# Usage: ./validate-app.sh <chemin_vers_app>

set -e

if [ $# -ne 1 ]; then
    echo "Usage: $0 <chemin_vers_app>"
    echo "Exemple: $0 apps/monapp_ynh"
    exit 1
fi

APP_PATH="$1"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Le dossier $APP_PATH n'existe pas"
    exit 1
fi

echo "🔍 Validation de l'application dans $APP_PATH"
echo "================================================"

cd "$APP_PATH"

# Compteurs
ERRORS=0
WARNINGS=0

# Fonction pour afficher les erreurs
error() {
    echo "❌ ERREUR: $1"
    ((ERRORS++))
}

# Fonction pour afficher les avertissements
warning() {
    echo "⚠️  AVERTISSEMENT: $1"
    ((WARNINGS++))
}

# Fonction pour afficher les succès
success() {
    echo "✅ $1"
}

echo "📋 Vérification de la structure..."

# Vérifier les fichiers obligatoires
if [ -f "manifest.toml" ]; then
    success "manifest.toml trouvé"
    
    # Vérifier la syntaxe TOML
    if python3 -c "import tomllib; tomllib.load(open('manifest.toml', 'rb'))" 2>/dev/null; then
        success "Syntaxe manifest.toml valide"
    else
        error "Syntaxe manifest.toml invalide"
    fi
elif [ -f "manifest.json" ]; then
    success "manifest.json trouvé"
    
    # Vérifier la syntaxe JSON
    if python3 -m json.tool manifest.json > /dev/null 2>&1; then
        success "Syntaxe manifest.json valide"
    else
        error "Syntaxe manifest.json invalide"
    fi
else
    error "Aucun fichier manifest.toml ou manifest.json trouvé"
fi

# Vérifier les scripts obligatoires
REQUIRED_SCRIPTS=("install" "remove" "upgrade" "backup" "restore")

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ -f "scripts/$script" ]; then
        success "Script scripts/$script trouvé"
        
        # Vérifier que le script est exécutable
        if [ -x "scripts/$script" ]; then
            success "Script scripts/$script est exécutable"
        else
            warning "Script scripts/$script n'est pas exécutable"
        fi
        
        # Vérifier la syntaxe bash
        if bash -n "scripts/$script" 2>/dev/null; then
            success "Syntaxe scripts/$script valide"
        else
            error "Erreur de syntaxe dans scripts/$script"
        fi
    else
        error "Script scripts/$script manquant"
    fi
done

echo ""
echo "🔒 Vérification de sécurité..."

# Vérifier les commandes dangereuses
if grep -r "rm -rf /" scripts/ 2>/dev/null; then
    error "Commande dangereuse 'rm -rf /' détectée"
fi

if grep -r "chmod 777" scripts/ 2>/dev/null; then
    warning "Permissions 777 détectées (potentiellement dangereuses)"
fi

if grep -r "curl.*|.*sh" scripts/ 2>/dev/null; then
    warning "Téléchargement et exécution direct détecté"
fi

# Vérifier les mots de passe en dur
if grep -r "password.*=" scripts/ | grep -v "YNH_APP_ARG" 2>/dev/null; then
    warning "Possible mot de passe en dur détecté"
fi

echo ""
echo "📁 Vérification des fichiers recommandés..."

# Fichiers recommandés
if [ -f "README.md" ]; then
    success "README.md présent"
else
    warning "README.md manquant (recommandé)"
fi

if [ -d "conf" ]; then
    success "Dossier conf/ présent"
else
    warning "Dossier conf/ manquant (souvent nécessaire)"
fi

if [ -d "doc" ]; then
    success "Dossier doc/ présent"
else
    warning "Dossier doc/ manquant (recommandé)"
fi

echo ""
echo "📊 Résumé de la validation"
echo "========================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🎉 Parfait ! Aucun problème détecté."
    echo "✅ Votre application est prête pour la soumission."
elif [ $ERRORS -eq 0 ]; then
    echo "✅ Validation réussie avec $WARNINGS avertissement(s)."
    echo "💡 Corrigez les avertissements pour une meilleure qualité."
else
    echo "❌ Validation échouée avec $ERRORS erreur(s) et $WARNINGS avertissement(s)."
    echo "🔧 Corrigez les erreurs avant de soumettre votre application."
fi

echo ""
echo "📋 Prochaines étapes :"
if [ $ERRORS -eq 0 ]; then
    echo "1. Testez l'installation : yunohost app install $APP_PATH"
    echo "2. Soumettez via : https://github.com/Liberchat/LiberChat-Marketplace/issues/new?template=submit_app.md"
else
    echo "1. Corrigez les erreurs listées ci-dessus"
    echo "2. Relancez la validation : $0 $APP_PATH"
fi

exit $ERRORS