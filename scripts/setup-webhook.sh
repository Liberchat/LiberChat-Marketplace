#!/bin/bash

# Script d'installation du système de notifications webhook
# Usage: sudo ./setup-webhook.sh

set -e

WEBHOOK_USER="liberchat-webhook"
WEBHOOK_DIR="/opt/liberchat-webhook"
SERVICE_NAME="liberchat-webhook"

echo "=== Installation du système de notifications LiberChat ==="

# Vérifier les privilèges root
if [ "$EUID" -ne 0 ]; then
    echo "Ce script doit être exécuté en tant que root"
    exit 1
fi

# Installer les dépendances
echo "Installation des dépendances..."
apt update
apt install -y python3 python3-pip nginx

# Créer l'utilisateur système
echo "Création de l'utilisateur système..."
if ! id "$WEBHOOK_USER" &>/dev/null; then
    useradd --system --home "$WEBHOOK_DIR" --shell /bin/false "$WEBHOOK_USER"
fi

# Créer le répertoire de travail
echo "Création du répertoire de travail..."
mkdir -p "$WEBHOOK_DIR"
mkdir -p /var/log/liberchat

# Copier le script webhook
echo "Installation du script webhook..."
cp webhook-notify.py "$WEBHOOK_DIR/"
chmod +x "$WEBHOOK_DIR/webhook-notify.py"

# Créer le service systemd
echo "Création du service systemd..."
cat > "/etc/systemd/system/$SERVICE_NAME.service" << EOF
[Unit]
Description=LiberChat Webhook Notification Service
After=network.target

[Service]
Type=simple
User=$WEBHOOK_USER
Group=$WEBHOOK_USER
WorkingDirectory=$WEBHOOK_DIR
ExecStart=/usr/bin/python3 $WEBHOOK_DIR/webhook-notify.py
Restart=always
RestartSec=10

# Sécurité
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/log/liberchat

[Install]
WantedBy=multi-user.target
EOF

# Configuration nginx pour le webhook
echo "Configuration nginx..."
cat > "/etc/nginx/sites-available/liberchat-webhook" << EOF
server {
    listen 80;
    server_name webhook.votre-domaine.tld;  # Changez ce domaine
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Activer le site nginx
ln -sf /etc/nginx/sites-available/liberchat-webhook /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Configurer les permissions
chown -R "$WEBHOOK_USER:$WEBHOOK_USER" "$WEBHOOK_DIR"
chown "$WEBHOOK_USER:$WEBHOOK_USER" /var/log/liberchat

# Activer et démarrer le service
echo "Activation du service..."
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl start "$SERVICE_NAME"

# Vérifier le statut
echo "Vérification du service..."
sleep 2
if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo "✅ Service webhook démarré avec succès"
else
    echo "❌ Erreur lors du démarrage du service"
    systemctl status "$SERVICE_NAME"
    exit 1
fi

# Instructions finales
echo ""
echo "=== Installation terminée ==="
echo ""
echo "Le service webhook est maintenant actif sur le port 8080"
echo ""
echo "Prochaines étapes :"
echo "1. Configurez votre domaine 'webhook.votre-domaine.tld' pour pointer vers ce serveur"
echo "2. Configurez le webhook GitHub :"
echo "   - URL: http://webhook.votre-domaine.tld"
echo "   - Content type: application/json"
echo "   - Events: Releases"
echo "3. Modifiez les paramètres dans $WEBHOOK_DIR/webhook-notify.py"
echo ""
echo "Commandes utiles :"
echo "- Statut: systemctl status $SERVICE_NAME"
echo "- Logs: journalctl -u $SERVICE_NAME -f"
echo "- Redémarrer: systemctl restart $SERVICE_NAME"
echo ""
echo "Pour activer les mises à jour automatiques (ATTENTION: peut être risqué) :"
echo "echo 'enabled' | sudo tee /etc/liberchat/auto-update.conf"