# Packaging Contacts Libres CNT-AIT pour YunoHost

Ce package permet d'installer facilement Contacts Libres CNT-AIT sur un serveur YunoHost.

## Vue d'ensemble

**Contacts Libres CNT-AIT** est une application de gestion de contacts décentralisée conçue pour les militant·es anarcho-syndicalistes, collectifs et groupes affinitaires qui ont besoin d'un outil autonome pour protéger leur vie privée et leurs réseaux.

**Version incluse :** 1.0

## Captures d'écran

![Interface principale](./doc/screenshots/main-interface.png)
![Formulaire de contact](./doc/screenshots/contact-form.png)

## Avertissements / informations importantes

- Cette application nécessite un domaine dédié ou un sous-domaine
- L'authentification LDAP n'est pas supportée (par design pour l'autonomie)
- Les données sont stockées localement en SQLite avec chiffrement
- Aucune donnée n'est envoyée vers des services tiers

## Fonctionnalités

- ✅ Gestion sécurisée des contacts avec chiffrement local
- ✅ Authentification simple sans email obligatoire  
- ✅ Partage temporaire de contacts via liens sécurisés
- ✅ Import/Export des contacts en JSON
- ✅ Interface responsive avec thème anarcho-syndicaliste
- ✅ Multi-instance supportée
- ❌ Intégration LDAP (volontairement non supportée)
- ❌ SSO YunoHost (par design pour l'autonomie)

## Installation

### Via l'interface d'administration YunoHost

1. Aller dans Applications > Installer une application
2. Utiliser le catalogue communautaire ou ajouter ce dépôt
3. Rechercher "Contacts Libres CNT-AIT"
4. Suivre les instructions d'installation

### Via la ligne de commande

```bash
sudo yunohost app install https://github.com/cnt-ait/contacts-libres-yunohost
```

## Configuration

### Paramètres d'installation

- **Domaine** : Domaine ou sous-domaine pour l'application
- **Chemin** : Chemin d'installation (par défaut `/contacts`)
- **Administrateur** : Utilisateur YunoHost qui sera administrateur
- **Mot de passe** : Mot de passe pour l'application

### Après installation

1. Accéder à l'application via l'URL configurée
2. Créer un compte utilisateur
3. Commencer à ajouter des contacts

## Utilisation

### Gestion des contacts
- Ajouter des contacts avec nom, prénom, téléphone, email, notes
- Rechercher et filtrer les contacts
- Modifier ou supprimer des contacts existants

### Partage sécurisé
- Générer des liens de partage temporaires (30 minutes)
- Partager des contacts via codes uniques
- Accès sécurisé sans compte requis

### Sauvegarde
- Exporter tous les contacts en JSON
- Importer des contacts depuis un fichier JSON
- Sauvegarde automatique via YunoHost

## Sécurité

- **Chiffrement** : Données chiffrées avec AES-256
- **Authentification** : Tokens JWT avec expiration
- **Isolation** : Chaque utilisateur ne voit que ses contacts
- **Partages** : Liens temporaires avec expiration automatique
- **Audit** : Code source ouvert et auditable

## Maintenance

### Logs
```bash
sudo journalctl -u contacts-libres-cnt -f
```

### Redémarrage
```bash
sudo systemctl restart contacts-libres-cnt
```

### Sauvegarde manuelle
```bash
sudo yunohost app backup contacts-libres-cnt
```

## Dépannage

### Problèmes courants

1. **Application ne démarre pas**
   - Vérifier les logs : `sudo journalctl -u contacts-libres-cnt`
   - Vérifier l'espace disque disponible

2. **Erreur de base de données**
   - Vérifier les permissions sur le répertoire de données
   - Redémarrer l'application

3. **Problème de chiffrement**
   - Vérifier la configuration JWT_SECRET
   - Réinstaller si nécessaire

### Support

- **Documentation** : [README principal](https://github.com/cnt-ait/contacts-libres)
- **Issues** : [GitHub Issues](https://github.com/cnt-ait/contacts-libres-yunohost/issues)
- **Communauté** : Forums CNT-AIT

## Développement

### Structure du package

```
├── manifest.toml          # Configuration du package
├── scripts/               # Scripts d'installation/mise à jour
│   ├── install
│   ├── remove
│   ├── upgrade
│   ├── backup
│   └── restore
├── conf/                  # Fichiers de configuration
│   ├── nginx.conf
│   ├── systemd.service
│   └── env
└── doc/                   # Documentation
```

### Tests

```bash
# Test d'installation
sudo yunohost app install . -a "domain=contacts.example.com&path=/&admin=admin&password=StrongPassword123"

# Test de sauvegarde/restauration
sudo yunohost backup create --apps contacts-libres-cnt
sudo yunohost app remove contacts-libres-cnt
sudo yunohost backup restore contacts-libres-cnt
```

## Licence

Ce package est sous licence MIT, comme l'application qu'il package.

## Liens

- **Site officiel** : https://cnt-ait.info
- **Dépôt de l'application** : https://github.com/Jesusiunchatnoir/contact-cnt-ait
- **Dépôt YunoHost** : https://github.com/Jesusiunchatnoir/contact-cnt-ait-yunohost
- **Documentation YunoHost** : https://yunohost.org/packaging_apps