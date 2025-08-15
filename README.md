# LiberChat Marketplace

Bienvenue dans la marketplace communautaire LiberChat ! Ce dépôt contient des applications YunoHost développées et maintenues par la communauté LiberChat, indépendamment du catalogue officiel YunoHost.

## 🚀 Applications disponibles

### LiberChat Server
Une alternative libre et auto-hébergée à ChatGPT avec interface web moderne.

- **Version actuelle :** 1.0.0
- **Statut :** ✅ Stable
- **Dépendances :** Node.js 18+, PostgreSQL, Redis

## 📦 Installation rapide

### Installer une application

```bash
# LiberChat Server
yunohost app install https://github.com/votre-compte/LiberChat-Marketplace/tree/main/apps/liberchatserver_ynh
```

### Mettre à jour une application

```bash
# Mettre à jour LiberChat Server
yunohost app upgrade liberchatserver -u https://github.com/votre-compte/LiberChat-Marketplace/tree/main/apps/liberchatserver_ynh
```

## 🔧 Dépendances système

Avant d'installer les applications, assurez-vous que votre serveur YunoHost dispose de :

- **RAM minimum :** 2 GB (4 GB recommandés)
- **Espace disque :** 10 GB libres minimum
- **YunoHost version :** 11.0+
- **Domaine configuré** avec certificat SSL

## 📚 Guides d'installation détaillés

Consultez le fichier [install-guide.md](./install-guide.md) pour des instructions pas à pas avec captures d'écran et résolution des problèmes courants.

## ⚠️ Résolution des problèmes courants

### Erreur "Domain already used"
```bash
# Vérifier les domaines utilisés
yunohost domain list
# Utiliser un sous-domaine différent
```

### Erreur de mémoire insuffisante
```bash
# Vérifier la RAM disponible
free -h
# Créer un fichier swap si nécessaire
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Erreur de ports occupés
```bash
# Vérifier les ports utilisés
sudo netstat -tlnp
# L'application utilisera automatiquement des ports libres
```

## 🔔 Notifications de mise à jour

Pour recevoir les notifications de nouvelles versions :

1. **Watch ce dépôt** en cliquant sur "Watch" → "All Activity"
2. **Activez les notifications GitHub** dans vos paramètres
3. **Utilisez le script de vérification** (optionnel) :

```bash
# Télécharger le script de vérification
wget https://raw.githubusercontent.com/votre-compte/LiberChat-Marketplace/main/scripts/check-updates.sh
chmod +x check-updates.sh

# Ajouter à crontab pour vérification quotidienne
echo "0 9 * * * /path/to/check-updates.sh" | crontab -
```

## 🤝 Contribuer

### Ajouter une nouvelle application

1. Créez un dossier dans `apps/` avec le nom `votre-app_ynh/`
2. Suivez la structure standard YunoHost
3. Testez votre paquet localement
4. Soumettez une Pull Request

### Structure requise pour une app
```
apps/votre-app_ynh/
├── manifest.json
├── scripts/
│   ├── install
│   ├── remove
│   ├── upgrade
│   ├── backup
│   └── restore
├── conf/
└── doc/
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🆘 Support

- **Issues GitHub :** [Créer un ticket](https://github.com/votre-compte/LiberChat-Marketplace/issues)
- **Forum YunoHost :** [forum.yunohost.org](https://forum.yunohost.org)
- **Documentation YunoHost :** [yunohost.org/packaging_apps](https://yunohost.org/packaging_apps)

---

⭐ **N'oubliez pas de mettre une étoile au projet si il vous est utile !**