---
name: 📦 Soumettre une application
about: Proposer une nouvelle application YunoHost pour la marketplace
title: '[APP] Nom de votre application'
labels: 'app-submission'
assignees: ''

---

## 📋 Informations sur l'application

### Détails de base
- **Nom de l'application** : 
- **Description courte** : 
- **Version actuelle** : 
- **Licence** : 
- **Site web** : 
- **Dépôt GitHub YunoHost** : 

### Fonctionnalités principales
- [ ] Fonctionnalité 1
- [ ] Fonctionnalité 2
- [ ] Fonctionnalité 3

### Compatibilité
- **YunoHost version minimum** : 
- **Architectures supportées** : x86_64 / arm64 / armhf / all
- **Multi-instance** : Oui / Non
- **LDAP/SSO** : Oui / Non
- **Ressources requises** :
  - RAM : 
  - Stockage : 

## ✅ Checklist de validation

### Prérequis obligatoires
- [ ] L'application fonctionne sur YunoHost 11.2+
- [ ] Le dépôt contient un `manifest.toml` valide
- [ ] Les scripts `install`, `remove`, `upgrade`, `backup`, `restore` sont présents
- [ ] L'application a été testée localement
- [ ] La documentation utilisateur est présente
- [ ] L'application respecte les standards YunoHost

### Sécurité et qualité
- [ ] Aucune vulnérabilité connue
- [ ] Code source disponible et auditable
- [ ] Respect des bonnes pratiques de sécurité
- [ ] Gestion correcte des permissions
- [ ] Logs appropriés pour le débogage

### Tests effectués
- [ ] Installation propre
- [ ] Désinstallation propre
- [ ] Sauvegarde/restauration
- [ ] Mise à jour depuis version précédente
- [ ] Fonctionnement en multi-instance (si applicable)

## 🔍 Informations techniques

### Configuration nginx
- [ ] Configuration nginx fournie et testée
- [ ] Support HTTPS
- [ ] Gestion des sous-chemins si nécessaire

### Base de données
- [ ] Type de base de données : PostgreSQL / MySQL / SQLite / Aucune
- [ ] Scripts de migration fournis (si applicable)

### Services système
- [ ] Service systemd configuré
- [ ] Gestion des dépendances système
- [ ] Intégration avec fail2ban (si applicable)

## 📝 Informations supplémentaires

### Capture d'écran
<!-- Ajoutez une capture d'écran de votre application -->

### Notes particulières
<!-- Informations importantes pour les mainteneurs -->

### Contact
- **Mainteneur principal** : 
- **Email de contact** : 
- **Disponibilité pour support** : 

---

## 🤖 Pour les mainteneurs

Une fois cette issue créée, le bot de validation automatique va :
1. Cloner et analyser le dépôt
2. Vérifier la conformité YunoHost
3. Tester l'installation en environnement isolé
4. Générer un rapport de validation
5. Proposer l'intégration si tous les tests passent

**Merci de contribuer à la marketplace Liberchat ! 🚀**