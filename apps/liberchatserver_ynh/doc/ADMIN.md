# Documentation Administrateur - LiberChat Server

## Configuration post-installation

### Accès administrateur

Après l'installation, connectez-vous avec le compte administrateur YunoHost sélectionné lors de l'installation. Vous aurez automatiquement les droits d'administration sur LiberChat.

### Configuration des modèles d'IA

1. **OpenAI (recommandé)**
   ```bash
   # Éditez le fichier de configuration
   sudo nano /var/www/liberchatserver/.env
   
   # Ajoutez votre clé API
   OPENAI_API_KEY=sk-your-api-key-here
   OPENAI_MODELS=gpt-3.5-turbo,gpt-4,gpt-4-turbo
   ```

2. **Anthropic Claude**
   ```bash
   ANTHROPIC_API_KEY=your-anthropic-key
   ```

3. **Google Gemini**
   ```bash
   GOOGLE_KEY=your-google-api-key
   ```

Redémarrez le service après modification :
```bash
sudo systemctl restart liberchatserver
```

### Gestion des utilisateurs

#### Créer un utilisateur administrateur
```bash
# Via l'interface web : Paramètres > Utilisateurs > Nouveau
# Ou via la base de données
sudo -u postgres psql liberchatserver -c "UPDATE users SET role='admin' WHERE email='user@domain.com';"
```

#### Activer/désactiver l'inscription publique
```bash
# Éditez la configuration
sudo nano /var/www/liberchatserver/.env

# Modifiez cette ligne
REGISTRATION_ENABLED=false  # true pour activer
```

### Monitoring et logs

#### Vérifier le statut
```bash
# Statut du service
sudo systemctl status liberchatserver

# Logs en temps réel
sudo journalctl -u liberchatserver -f

# Logs d'erreur nginx
sudo tail -f /var/log/nginx/error.log
```

#### Métriques d'utilisation
```bash
# Connexions actives
sudo netstat -an | grep :3000

# Utilisation mémoire
ps aux | grep liberchat

# Espace disque utilisé
du -sh /var/www/liberchatserver
du -sh /home/yunohost.app/liberchatserver
```

### Sauvegarde et restauration

#### Sauvegarde manuelle
```bash
# Sauvegarde complète YunoHost
sudo yunohost backup create --apps liberchatserver

# Sauvegarde base de données uniquement
sudo -u postgres pg_dump liberchatserver > backup_$(date +%Y%m%d).sql
```

#### Restauration
```bash
# Restaurer depuis une sauvegarde YunoHost
sudo yunohost backup restore nom_de_la_sauvegarde

# Restaurer base de données uniquement
sudo -u postgres psql liberchatserver < backup_20240101.sql
```

### Optimisation des performances

#### Configuration PostgreSQL
```bash
# Éditez la configuration PostgreSQL
sudo nano /etc/postgresql/*/main/postgresql.conf

# Optimisations recommandées
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
```

#### Configuration Redis
```bash
# Éditez la configuration Redis
sudo nano /etc/redis/redis.conf

# Optimisations
maxmemory 512mb
maxmemory-policy allkeys-lru
```

### Sécurité

#### Mise à jour des dépendances
```bash
# Mise à jour Node.js et npm
sudo npm update -g npm
sudo npm audit fix

# Mise à jour des paquets système
sudo apt update && sudo apt upgrade
```

#### Configuration fail2ban
```bash
# Créer un filtre pour LiberChat
sudo nano /etc/fail2ban/filter.d/liberchat.conf

[Definition]
failregex = ^.*"ip":"<HOST>".*"level":"error".*"message":"Failed login attempt".*$
ignoreregex =

# Ajouter la jail
sudo nano /etc/fail2ban/jail.d/liberchat.conf

[liberchat]
enabled = true
port = http,https
filter = liberchat
logpath = /var/log/liberchatserver/liberchatserver.log
maxretry = 5
bantime = 3600
```

### Résolution des problèmes

#### Service ne démarre pas
```bash
# Vérifier les logs
sudo journalctl -u liberchatserver --no-pager

# Vérifier la configuration
sudo -u liberchatserver node -c /var/www/liberchatserver/server.js

# Vérifier les permissions
sudo chown -R liberchatserver:liberchatserver /var/www/liberchatserver
```

#### Problèmes de base de données
```bash
# Vérifier la connexion PostgreSQL
sudo -u postgres psql -l

# Recréer la base si nécessaire
sudo -u postgres dropdb liberchatserver
sudo -u postgres createdb liberchatserver -O liberchatserver
```

#### Problèmes de mémoire
```bash
# Ajouter du swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Rendre permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Maintenance régulière

#### Script de maintenance hebdomadaire
```bash
#!/bin/bash
# /home/admin/maintenance-liberchat.sh

echo "=== Maintenance LiberChat $(date) ==="

# Nettoyage des logs anciens
find /var/log/liberchatserver -name "*.log" -mtime +30 -delete

# Nettoyage de la base de données
sudo -u postgres psql liberchatserver -c "DELETE FROM sessions WHERE expires < NOW();"

# Vérification de l'espace disque
df -h /var/www/liberchatserver

# Redémarrage si nécessaire
if ! systemctl is-active --quiet liberchatserver; then
    systemctl restart liberchatserver
    echo "Service redémarré"
fi

echo "Maintenance terminée"
```

#### Programmation avec crontab
```bash
# Ajouter à crontab
echo "0 3 * * 0 /home/admin/maintenance-liberchat.sh >> /var/log/liberchat-maintenance.log 2>&1" | sudo crontab -
```

### Support et communauté

- **Documentation officielle** : [docs.liberchat.ai](https://docs.liberchat.ai)
- **Issues GitHub** : [github.com/votre-compte/LiberChat-Marketplace/issues](https://github.com/votre-compte/LiberChat-Marketplace/issues)
- **Forum YunoHost** : [forum.yunohost.org](https://forum.yunohost.org)

Pour toute question spécifique, n'hésitez pas à créer un ticket sur GitHub avec les logs et la description détaillée du problème.