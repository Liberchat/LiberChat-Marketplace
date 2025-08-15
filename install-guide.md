# Guide d'installation détaillé - LiberChat Marketplace

Ce guide vous accompagne pas à pas dans l'installation des applications de la marketplace LiberChat.

## 📋 Prérequis

### Vérification du système

Avant de commencer, vérifiez que votre serveur répond aux exigences :

```bash
# Vérifier la version de YunoHost
yunohost --version

# Vérifier l'espace disque disponible
df -h

# Vérifier la RAM disponible
free -h

# Vérifier les domaines configurés
yunohost domain list
```

**Exigences minimales :**
- YunoHost 11.0+
- 2 GB RAM (4 GB recommandés)
- 10 GB d'espace disque libre
- Un domaine configuré avec SSL

## 🚀 Installation de Liberchat

## 🚀 Installation de contact-cnt-ait

### Étape 1 : Installation

```bash
yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/contact-cnt-ait_ynh
```


### Étape 1 : Préparation

1. **Connectez-vous à votre serveur YunoHost**
   ```bash
   ssh admin@votre-domaine.tld
   ```

2. **Mettez à jour YunoHost**
   ```bash
   sudo yunohost tools update
   sudo yunohost tools upgrade
   ```

### Étape 2 : Installation

1. **Lancez l'installation**
   ```bash
   yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/liberchat_ynh
   ```

2. **Répondez aux questions d'installation**
   
   L'installateur vous demandera :
   
   - **Domaine :** Choisissez un domaine ou sous-domaine (ex: `chat.mondomaine.tld`)
   - **Chemin :** Laissez `/` pour installer à la racine du domaine
   - **Utilisateur admin :** Sélectionnez l'utilisateur YunoHost qui sera administrateur
   - **Accès public :** `Oui` si vous voulez que l'app soit accessible sans connexion YunoHost
   - **Langue :** Choisissez votre langue préférée

### Étape 3 : Configuration post-installation

1. **Accédez à votre application**
   
   Ouvrez votre navigateur et allez sur `https://votre-domaine.tld`

2. **Configuration initiale**
   
   - Créez votre compte administrateur
   - Configurez les paramètres de base
   - Testez l'envoi de messages

### Étape 4 : Vérification

```bash
# Vérifier que l'application est bien installée
yunohost app list

# Vérifier les logs en cas de problème
yunohost log show

# Vérifier le statut des services
systemctl status liberchat
```

## 🔄 Mise à jour

### Mise à jour manuelle

```bash
# Mettre à jour vers la dernière version
yunohost app upgrade liberchat -u https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/liberchat_ynh
```

### Mise à jour automatique (optionnel)

1. **Créez un script de mise à jour**
   ```bash
   nano ~/update-liberchat.sh
   ```

2. **Contenu du script**
   ```bash
   #!/bin/bash
   echo "Vérification des mises à jour LiberChat..."
   yunohost app upgrade liberchat -u https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/liberchat_ynh
   echo "Mise à jour terminée !"
   ```

3. **Rendez le script exécutable**
   ```bash
   chmod +x ~/update-liberchat.sh
   ```

4. **Programmez l'exécution hebdomadaire**
   ```bash
   crontab -e
   # Ajoutez cette ligne pour une vérification tous les dimanches à 3h
   0 3 * * 0 /home/admin/update-liberchat.sh >> /var/log/liberchat-update.log 2>&1
   ```

## 🛠️ Résolution des problèmes

### Problème : Installation échoue avec "Not enough space"

**Solution :**
```bash
# Nettoyer les paquets inutiles
sudo apt autoremove
sudo apt autoclean

# Vérifier l'espace après nettoyage
df -h
```

### Problème : Erreur "Port already in use"

**Solution :**
```bash
# Identifier le processus utilisant le port
sudo netstat -tlnp | grep :3000

# Arrêter le service si nécessaire
sudo systemctl stop nom-du-service

# Relancer l'installation
yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/liberchat_ynh
```

### Problème : Application inaccessible après installation

**Vérifications :**

1. **Vérifier le statut du service**
   ```bash
   systemctl status liberchat
   ```

2. **Vérifier les logs**
   ```bash
   journalctl -u liberchat -f
   ```

3. **Vérifier la configuration nginx**
   ```bash
   nginx -t
   sudo systemctl reload nginx
   ```

### Problème : Erreur de base de données

**Solution :**
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Redémarrer si nécessaire
sudo systemctl restart postgresql

# Vérifier les connexions
sudo -u postgres psql -l
```

## 📊 Monitoring et maintenance

### Vérification quotidienne

```bash
# Script de vérification de santé
#!/bin/bash
echo "=== Vérification LiberChat ==="
echo "Statut du service:"
systemctl is-active liberchat

echo "Utilisation mémoire:"
ps aux | grep liberchat | grep -v grep

echo "Espace disque:"
df -h /var/www/liberchat

echo "Dernières erreurs:"
journalctl -u liberchat --since "1 hour ago" | grep ERROR
```

### Sauvegarde

```bash
# Créer une sauvegarde
yunohost backup create --apps liberchat

# Lister les sauvegardes
yunohost backup list

# Restaurer si nécessaire
yunohost backup restore nom-de-la-sauvegarde
```

## 🔐 Sécurité

### Recommandations de sécurité

1. **Activez fail2ban**
   ```bash
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

2. **Mettez à jour régulièrement**
   ```bash
   # Système
   sudo apt update && sudo apt upgrade

   # YunoHost
   yunohost tools update && yunohost tools upgrade
   ```

3. **Surveillez les logs**
   ```bash
   # Configurer logrotate pour éviter les logs trop volumineux
   sudo nano /etc/logrotate.d/liberchat
   ```

## 📞 Support

Si vous rencontrez des problèmes non couverts par ce guide :

1. **Consultez les issues GitHub** : [Issues du projet](https://github.com/Liberchat/LiberChat-Marketplace/issues)
2. **Créez un nouveau ticket** avec :
   - Version de YunoHost (`yunohost --version`)
   - Logs d'erreur (`yunohost log show`)
   - Description détaillée du problème
3. **Forum YunoHost** : [forum.yunohost.org](https://forum.yunohost.org)

---

💡 **Conseil :** Gardez ce guide à portée de main et n'hésitez pas à le consulter lors des mises à jour !