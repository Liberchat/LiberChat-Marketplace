# Administration de Contacts Libres CNT-AIT

## Configuration

L'application utilise les variables d'environnement suivantes :
- `NODE_ENV` : Environnement d'exécution (production)
- `PORT` : Port d'écoute du serveur
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `DATA_DIR` : Répertoire de données

## Logs

Les logs sont disponibles dans `/var/log/contact-cnt-ait/`

## Base de données

L'application utilise SQLite avec le fichier `contacts.db` dans le répertoire de données.

## Sauvegarde

Les données importantes à sauvegarder :
- Base de données SQLite
- Fichiers uploadés (si applicable)
- Configuration d'environnement