const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DATA_DIR = process.env.DATA_DIR || './data';

// Middleware
app.use(cors());
app.use(express.json());

// Log des requêtes pour debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Route de test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne correctement', timestamp: new Date().toISOString() });
});

// Créer le répertoire de données s'il n'existe pas
const fs = require('fs');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('Répertoire de données créé:', DATA_DIR);
}

// Base de données SQLite
const dbPath = path.join(DATA_DIR, 'contacts.db');
console.log('Chemin de la base de données:', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données:', err);
  } else {
    console.log('Base de données SQLite connectée avec succès');
  }
});

// Initialisation des tables
db.serialize(() => {
  console.log('Initialisation des tables de la base de données...');
  // Table des utilisateurs
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    encryption_key TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Table des contacts
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    encrypted_data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Table des partages temporaires
  db.run(`CREATE TABLE IF NOT EXISTS shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER NOT NULL,
    share_code TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts (id)
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table shares:', err);
    } else {
      console.log('Tables de la base de données initialisées avec succès');
    }
  });
});

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Routes d'authentification
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptionKey = crypto.lib.WordArray.random(256/8).toString();

    db.run(
      'INSERT INTO users (username, password_hash, encryption_key) VALUES (?, ?, ?)',
      [username, hashedPassword, encryptionKey],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Nom d\'utilisateur déjà utilisé' });
          }
          return res.status(500).json({ error: 'Erreur lors de la création du compte' });
        }

        const token = jwt.sign(
          { userId: this.lastID, username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Compte créé avec succès',
          token,
          user: { id: this.lastID, username }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Utilisateur non trouvé' });
      }

      try {
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
          return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Connexion réussie',
          token,
          user: { id: user.id, username: user.username }
        });
      } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
      }
    }
  );
});

// Routes des contacts
app.get('/api/contacts', authenticateToken, (req, res) => {
  db.all(
    'SELECT c.*, u.encryption_key FROM contacts c JOIN users u ON c.user_id = u.id WHERE c.user_id = ?',
    [req.user.userId],
    (err, contacts) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des contacts' });
      }

      const decryptedContacts = contacts.map(contact => {
        try {
          const decryptedData = crypto.AES.decrypt(contact.encrypted_data, contact.encryption_key).toString(crypto.enc.Utf8);
          const contactData = JSON.parse(decryptedData);
          return {
            id: contact.id,
            ...contactData,
            created_at: contact.created_at,
            updated_at: contact.updated_at
          };
        } catch (error) {
          return null;
        }
      }).filter(contact => contact !== null);

      res.json(decryptedContacts);
    }
  );
});

app.post('/api/contacts', authenticateToken, (req, res) => {
  const { firstName, lastName, phone, email, note } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'Prénom et nom requis' });
  }

  db.get(
    'SELECT encryption_key FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      const contactData = { firstName, lastName, phone, email, note };
      const encryptedData = crypto.AES.encrypt(JSON.stringify(contactData), user.encryption_key).toString();

      db.run(
        'INSERT INTO contacts (user_id, encrypted_data) VALUES (?, ?)',
        [req.user.userId, encryptedData],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la création du contact' });
          }

          res.json({
            message: 'Contact créé avec succès',
            contact: { id: this.lastID, ...contactData }
          });
        }
      );
    }
  );
});

app.put('/api/contacts/:id', authenticateToken, (req, res) => {
  const { firstName, lastName, phone, email, note } = req.body;
  const contactId = req.params.id;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'Prénom et nom requis' });
  }

  db.get(
    'SELECT encryption_key FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      const contactData = { firstName, lastName, phone, email, note };
      const encryptedData = crypto.AES.encrypt(JSON.stringify(contactData), user.encryption_key).toString();

      db.run(
        'UPDATE contacts SET encrypted_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        [encryptedData, contactId, req.user.userId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du contact' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: 'Contact non trouvé' });
          }

          res.json({
            message: 'Contact mis à jour avec succès',
            contact: { id: contactId, ...contactData }
          });
        }
      );
    }
  );
});

app.delete('/api/contacts/:id', authenticateToken, (req, res) => {
  const contactId = req.params.id;

  db.run(
    'DELETE FROM contacts WHERE id = ? AND user_id = ?',
    [contactId, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la suppression du contact' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Contact non trouvé' });
      }

      res.json({ message: 'Contact supprimé avec succès' });
    }
  );
});

// Routes de partage
app.post('/api/contacts/:id/share', authenticateToken, (req, res) => {
  const contactId = req.params.id;
  const shareCode = uuidv4();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  db.run(
    'INSERT INTO shares (contact_id, share_code, expires_at) VALUES (?, ?, ?)',
    [contactId, shareCode, expiresAt.toISOString()],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la création du partage' });
      }

      res.json({
        message: 'Code de partage créé',
        shareCode,
        expiresAt: expiresAt.toISOString()
      });
    }
  );
});

app.get('/api/share/:shareCode', (req, res) => {
  const shareCode = req.params.shareCode;

  db.get(
    `SELECT c.*, u.encryption_key, s.expires_at 
     FROM shares s 
     JOIN contacts c ON s.contact_id = c.id 
     JOIN users u ON c.user_id = u.id 
     WHERE s.share_code = ?`,
    [shareCode],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (!result) {
        return res.status(404).json({ error: 'Partage non trouvé' });
      }

      const expiresAt = new Date(result.expires_at);
      if (expiresAt < new Date()) {
        return res.status(410).json({ error: 'Partage expiré' });
      }

      try {
        const decryptedData = crypto.AES.decrypt(result.encrypted_data, result.encryption_key).toString(crypto.enc.Utf8);
        const contactData = JSON.parse(decryptedData);

        res.json({
          contact: contactData,
          expiresAt: result.expires_at
        });
      } catch (error) {
        res.status(500).json({ error: 'Erreur lors du déchiffrement' });
      }
    }
  );
});

// Routes d'import/export
app.get('/api/contacts/export', authenticateToken, (req, res) => {
  db.all(
    'SELECT c.*, u.encryption_key FROM contacts c JOIN users u ON c.user_id = u.id WHERE c.user_id = ?',
    [req.user.userId],
    (err, contacts) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'export' });
      }

      const decryptedContacts = contacts.map(contact => {
        try {
          const decryptedData = crypto.AES.decrypt(contact.encrypted_data, contact.encryption_key).toString(crypto.enc.Utf8);
          return JSON.parse(decryptedData);
        } catch (error) {
          return null;
        }
      }).filter(contact => contact !== null);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="contacts.json"');
      res.json(decryptedContacts);
    }
  );
});

app.post('/api/contacts/import', authenticateToken, (req, res) => {
  const { contacts } = req.body;

  if (!Array.isArray(contacts)) {
    return res.status(400).json({ error: 'Format de données invalide' });
  }

  db.get(
    'SELECT encryption_key FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      let imported = 0;
      const promises = contacts.map(contact => {
        return new Promise((resolve, reject) => {
          if (!contact.firstName || !contact.lastName) {
            resolve();
            return;
          }

          const encryptedData = crypto.AES.encrypt(JSON.stringify(contact), user.encryption_key).toString();

          db.run(
            'INSERT INTO contacts (user_id, encrypted_data) VALUES (?, ?)',
            [req.user.userId, encryptedData],
            function(err) {
              if (err) {
                reject(err);
              } else {
                imported++;
                resolve();
              }
            }
          );
        });
      });

      Promise.all(promises)
        .then(() => {
          res.json({ message: `${imported} contacts importés avec succès` });
        })
        .catch(() => {
          res.status(500).json({ error: 'Erreur lors de l\'import' });
        });
    }
  );
});

// Nettoyage des partages expirés
setInterval(() => {
  db.run('DELETE FROM shares WHERE expires_at < ?', [new Date().toISOString()]);
}, 60 * 60 * 1000); // Toutes les heures

// Servir les fichiers statiques buildés APRES les routes API
const distPath = path.join(__dirname, '../dist');
console.log('Serving static files from:', distPath);
app.use(express.static(distPath));

// Route catch-all pour servir l'application React
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});