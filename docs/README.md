# Site Vitrine - Liberchat Marketplace

Ce dossier contient le site vitrine de la marketplace Liberchat, hébergé sur GitHub Pages.

## 🌐 Site en ligne

Le site est accessible à l'adresse : https://liberchat.github.io/LiberChat-Marketplace

## 📁 Structure

```
docs/
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── script.js           # JavaScript interactif
├── _config.yml         # Configuration GitHub Pages
└── README.md           # Cette documentation
```

## ✨ Fonctionnalités

### 🎨 Design moderne
- Interface responsive et accessible
- Animations fluides et interactions
- Terminal interactif avec animation de frappe
- Modal d'installation avec copie automatique

### 📱 Sections principales
- **Hero** : Présentation avec terminal interactif
- **Statistiques** : Compteurs animés
- **Applications** : Catalogue avec boutons d'installation
- **Fonctionnement** : Processus pour utilisateurs et développeurs
- **Fonctionnalités** : Avantages de la marketplace
- **Soumission** : Guide pour développeurs
- **Footer** : Liens utiles

### 🚀 Interactions
- Navigation fluide avec ancres
- Modal d'installation avec commandes copiables
- Animations au scroll
- Effets hover et transitions

## 🛠️ Développement local

Pour tester le site localement :

```bash
# Serveur simple Python
cd docs
python3 -m http.server 8000

# Ou avec Node.js
npx serve .

# Puis ouvrir http://localhost:8000
```

## 📝 Personnalisation

### Ajouter une nouvelle application

1. **Modifier `index.html`** :
   - Ajouter une nouvelle carte dans `.apps-grid`
   - Mettre à jour les statistiques si nécessaire

2. **Modifier `script.js`** :
   - Ajouter la commande d'installation dans `appCommands`
   - Ajouter le nom dans `appNames`

### Modifier le design

- **Couleurs** : Variables CSS dans `:root` de `styles.css`
- **Polices** : Import Google Fonts dans `index.html`
- **Animations** : Fonctions JavaScript dans `script.js`

## 🚀 Déploiement

Le site se déploie automatiquement via GitHub Pages quand vous poussez dans la branche `main`.

### Configuration GitHub Pages

1. Allez dans **Settings** > **Pages**
2. Source : **Deploy from a branch**
3. Branch : **main**
4. Folder : **/ (root)** ou **/docs**

## 📊 Analytics (optionnel)

Pour ajouter Google Analytics :

```html
<!-- Dans <head> de index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔧 Maintenance

### Mise à jour des applications
Quand une nouvelle app est ajoutée à la marketplace :

1. Mettre à jour la section applications dans `index.html`
2. Ajouter les commandes dans `script.js`
3. Mettre à jour les statistiques si nécessaire

### Optimisations possibles
- Compression des images
- Minification CSS/JS
- Service Worker pour cache
- Lazy loading des images

## 📱 Responsive

Le site est optimisé pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1200px+)

## ♿ Accessibilité

- Navigation au clavier
- Contrastes respectés
- Textes alternatifs
- Structure sémantique
- Focus visible

---

**Le site vitrine est prêt à promouvoir votre marketplace ! 🎉**