#!/usr/bin/env python3
"""
Webhook GitHub pour notifications de mise à jour
Déployez ce script sur votre serveur pour recevoir des notifications
automatiques lors de nouvelles releases.
"""

import json
import smtplib
import subprocess
import sys
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import HTTPServer, BaseHTTPRequestHandler
import logging

# Configuration
WEBHOOK_SECRET = "votre-secret-webhook-github"
NOTIFICATION_EMAIL = "admin@votre-domaine.tld"
SMTP_SERVER = "localhost"
SMTP_PORT = 25
LOG_FILE = "/var/log/liberchat-webhook.log"

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Traiter les webhooks GitHub"""
        try:
            # Lire le contenu
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Vérifier le secret (optionnel mais recommandé)
            github_signature = self.headers.get('X-Hub-Signature-256', '')
            
            # Parser le JSON
            payload = json.loads(post_data.decode('utf-8'))
            
            # Vérifier que c'est une release
            if 'action' in payload and payload['action'] == 'published':
                self.handle_release(payload)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'OK')
            else:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'Ignored')
                
        except Exception as e:
            logging.error(f"Erreur lors du traitement du webhook: {e}")
            self.send_response(500)
            self.end_headers()
            self.wfile.write(b'Error')
    
    def handle_release(self, payload):
        """Traiter une nouvelle release"""
        try:
            release = payload['release']
            repo_name = payload['repository']['name']
            tag_name = release['tag_name']
            release_name = release['name']
            release_notes = release['body']
            html_url = release['html_url']
            
            logging.info(f"Nouvelle release détectée: {repo_name} {tag_name}")
            
            # Envoyer notification email
            self.send_email_notification(
                repo_name, tag_name, release_name, release_notes, html_url
            )
            
            # Optionnel : déclencher une mise à jour automatique
            # self.trigger_auto_update(repo_name, tag_name)
            
        except Exception as e:
            logging.error(f"Erreur lors du traitement de la release: {e}")
    
    def send_email_notification(self, repo_name, tag_name, release_name, release_notes, html_url):
        """Envoyer une notification par email"""
        try:
            msg = MIMEMultipart()
            msg['From'] = f"LiberChat Marketplace <noreply@{NOTIFICATION_EMAIL.split('@')[1]}>"
            msg['To'] = NOTIFICATION_EMAIL
            msg['Subject'] = f"Nouvelle version disponible: {repo_name} {tag_name}"
            
            # Corps du message
            body = f"""
Une nouvelle version de {repo_name} est disponible !

Version: {tag_name}
Nom: {release_name}

Notes de version:
{release_notes}

Lien: {html_url}

Pour mettre à jour vos applications YunoHost:
yunohost app upgrade liberchat -u https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/liberchat_ynh

---
Notification automatique du LiberChat Marketplace
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Envoyer l'email
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.send_message(msg)
            server.quit()
            
            logging.info(f"Notification email envoyée pour {repo_name} {tag_name}")
            
        except Exception as e:
            logging.error(f"Erreur lors de l'envoi de l'email: {e}")
    
    def trigger_auto_update(self, repo_name, tag_name):
        """Déclencher une mise à jour automatique (optionnel)"""
        try:
            # Exemple : mettre à jour automatiquement si configuré
            # ATTENTION: Ceci peut être dangereux en production
            
            # Vérifier si l'auto-update est activé
            auto_update_file = "/etc/liberchat/auto-update.conf"
            try:
                with open(auto_update_file, 'r') as f:
                    config = f.read().strip()
                    if config != "enabled":
                        return
            except FileNotFoundError:
                return
            
            # Commande de mise à jour
            cmd = [
                "yunohost", "app", "upgrade", "liberchat",
                "-u", "https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/liberchat_ynh"
            ]
            
            logging.info(f"Déclenchement de la mise à jour automatique: {' '.join(cmd)}")
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logging.info("Mise à jour automatique réussie")
            else:
                logging.error(f"Échec de la mise à jour automatique: {result.stderr}")
                
        except Exception as e:
            logging.error(f"Erreur lors de la mise à jour automatique: {e}")
    
    def log_message(self, format, *args):
        """Supprimer les logs HTTP par défaut"""
        pass

def main():
    """Fonction principale"""
    port = 8080
    
    logging.info(f"Démarrage du serveur webhook sur le port {port}")
    
    server = HTTPServer(('localhost', port), WebhookHandler)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        logging.info("Arrêt du serveur webhook")
        server.server_close()

if __name__ == '__main__':
    main()