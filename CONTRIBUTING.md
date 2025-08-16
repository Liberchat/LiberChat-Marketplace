# 🤝 Contribuer à la Marketplace Liberchat

Merci de votre intérêt pour contribuer à la marketplace Liberchat ! Ce guide vous explique comment soumettre votre application YunoHost.

## 🚀 Processus de soumission automatique

### 1. Préparer votre application

Assurez-vous que votre application YunoHost :

#### ✅ Prérequis obligatoires
- [ ] Fonctionne sur YunoHost 11.2+
- [ ] Contient un `manifest.toml` ou `manifest.json` valide
- [ ] Inclut tous les scripts requis : `install`, `remove`, `upgrade`, `backup`, `restore`
- [ ] A été testée localement
- [ ] Respecte les [standards YunoHost](https://yunohost.org/packaging_apps)

#### 📋 Structure requise
```
votre-app_ynh/
├── manifest.toml          # Configuration de l'app
├── scripts/
│   ├── install           # Script d'installation
│   ├── remove            # Script de suppression
│   ├── upgrade           # Script de mise à jour
│   ├── backup            # Script de sauvegarde
│   └── restore           # Script de restauration
├── conf/                 # Fichiers de configuration
├── doc/                  # Documentation
└── README.md             # Documentation utilisateur
```

### 2. Soumettre votre application

1. **Créez une issue** en utilisant le template "📦 Soumettre une application"
2. **Remplissez tous les champs** requis avec précision
3. **Cochez toutes les cases** de validation applicables
4. **Soumettez l'issue**

### 3. Validation automatique

Notre bot va automatiquement :

#### 🔍 **Analyse de structure**
- Vérifier la présence des fichiers obligatoires
- Valider la syntaxe du manifest
- Contrôler la syntaxe des scripts bash

#### 🔒 **Vérification de sécurité**
- Détecter les commandes dangereuses
- Identifier les mots de passe en dur
- Vérifier les permissions inappropriées

#### 📊 **Analyse des métadonnées**
- Extraire les informations de l'application
- Vérifier la cohérence des données

### 4. Résultats de validation

Vous recevrez un commentaire automatique avec :

#### ✅ **Si validation réussie**
- Votre app passe à l'étape de revue manuelle
- Un mainteneur examine le code dans les 2-5 jours
- Intégration automatique possible avec `/integrate`

#### ❌ **Si validation échoue**
- Liste détaillée des erreurs à corriger
- Instructions pour relancer la validation
- Support disponible via les commentaires

### 5. Intégration finale

Une fois validée par un mainteneur :

1. **Commande `/integrate`** déclenche l'intégration automatique
2. **Votre app est ajoutée** à la marketplace
3. **Notifications configurées** pour les mises à jour
4. **Issue fermée** automatiquement

## 🛠️ Processus manuel (alternatif)

Si vous préférez contribuer manuellement :

### Fork et Pull Request

1. **Forkez** ce dépôt
2. **Clonez** votre fork localement
3. **Ajoutez** votre app avec le script :
   ```bash
   ./scripts/add-app.sh https://github.com/user/app_ynh app-name "Description" 1.0.0
   ```
4. **Testez** l'intégration
5. **Créez** une Pull Request

### Tests locaux

```bash
# Tester la structure
./scripts/validate-app.sh apps/votre-app_ynh

# Tester l'installation (nécessite YunoHost)
yunohost app install ./apps/votre-app_ynh
```

## 📋 Critères de qualité

### Code et sécurité
- ✅ Code source disponible et auditable
- ✅ Aucune vulnérabilité connue
- ✅ Respect des bonnes pratiques YunoHost
- ✅ Gestion appropriée des permissions
- ✅ Logs utiles pour le débogage

### Documentation
- ✅ README.md complet et à jour
- ✅ Instructions d'installation claires
- ✅ Documentation des fonctionnalités
- ✅ Informations de contact du mainteneur

### Tests
- ✅ Installation/désinstallation propres
- ✅ Sauvegarde/restauration fonctionnelles
- ✅ Mise à jour depuis version précédente
- ✅ Multi-instance (si applicable)
- ✅ Intégration LDAP/SSO (si applicable)

## 🆘 Support et aide

### Besoin d'aide ?

- **Issues GitHub** : [Créer une issue](https://github.com/Liberchat/LiberChat-Marketplace/issues)
- **Documentation YunoHost** : [yunohost.org/packaging_apps](https://yunohost.org/packaging_apps)
- **Forum YunoHost** : [forum.yunohost.org](https://forum.yunohost.org)

### Problèmes courants

#### Erreur de manifest
```bash
# Vérifier la syntaxe TOML
python3 -c "import tomllib; tomllib.load(open('manifest.toml', 'rb'))"
```

#### Erreur de script
```bash
# Vérifier la syntaxe bash
bash -n scripts/install
```

#### Problème de permissions
```bash
# Vérifier les permissions des scripts
chmod +x scripts/*
```

## 🎯 Après l'intégration

### Maintenance de votre app

1. **Mises à jour** : Créez des releases sur votre dépôt
2. **Notifications** : Les utilisateurs seront automatiquement notifiés
3. **Support** : Répondez aux issues sur votre dépôt
4. **Améliorations** : Soumettez des mises à jour via le même processus

### Promotion

- Partagez le lien d'installation avec votre communauté
- Documentez votre app sur le forum YunoHost
- Ajoutez le badge marketplace à votre README

```markdown
[![Marketplace Liberchat](https://img.shields.io/badge/Marketplace-Liberchat-blue)](https://github.com/Liberchat/LiberChat-Marketplace)
```

## 🏆 Reconnaissance

Les contributeurs sont listés dans :
- Les commits de la marketplace
- La documentation de leur application
- Les remerciements de la communauté

**Merci de faire grandir l'écosystème Liberchat ! 🚀**

---

## 📄 Licence

En contribuant, vous acceptez que votre contribution soit sous licence MIT, comme le reste du projet.