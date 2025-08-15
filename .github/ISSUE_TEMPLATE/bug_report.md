---
name: Bug Report
about: Signaler un problème avec une application
title: '[BUG] '
labels: bug
assignees: ''

---

## Description du problème
Une description claire et concise du problème rencontré.

## Application concernée
- [ ] LiberChat Server
- [ ] Autre (précisez) : 

## Environnement
- **Version YunoHost** : (ex: 11.2.0)
- **Version de l'app** : (ex: 1.0.0~ynh1)
- **Architecture** : (ex: x86_64, arm64)
- **RAM disponible** : (ex: 4 GB)

## Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '....'
3. Faire défiler jusqu'à '....'
4. Voir l'erreur

## Comportement attendu
Une description claire et concise de ce qui devrait se passer.

## Comportement actuel
Une description claire et concise de ce qui se passe réellement.

## Logs
```bash
# Logs YunoHost
yunohost log show

# Logs de l'application
sudo journalctl -u liberchat --no-pager

# Logs nginx (si pertinent)
sudo tail -n 50 /var/log/nginx/error.log
```

## Captures d'écran
Si applicable, ajoutez des captures d'écran pour expliquer le problème.

## Informations supplémentaires
Ajoutez toute autre information pertinente sur le problème ici.

## Checklist
- [ ] J'ai vérifié que ce problème n'a pas déjà été signalé
- [ ] J'ai inclus les logs pertinents
- [ ] J'ai testé avec la dernière version disponible