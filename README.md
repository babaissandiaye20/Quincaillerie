# 🏪 Système de Gestion de Quincaillerie

Un système complet de gestion de quincaillerie développé avec Node.js, Express, Prisma et MySQL, incluant la gestion des commandes, fournisseurs, paiements et utilisateurs avec différents rôles.

## 🚀 Fonctionnalités

### 🔐 Authentification et Rôles
- Connexion sécurisée obligatoire
- Interface multi-rôles selon les permissions
- Journalisation des actions

### 🧑‍💼 Gestionnaire
- Gestion des catégories, sous-catégories et produits
- Ajout, modification et archivage des ressources
- Gestion des fournisseurs

### 🛒 Responsable Achat
- Commandes fournisseurs
- Suivi des états (En cours, Livré, Payé)
- Filtrage par date et état

### 💰 Responsable Paiement
- Gestion des versements (max 3 par commande)
- Suivi des dettes fournisseurs
- Historique des paiements

### 📊 Statistiques
- Commandes en cours
- Commandes à livrer
- Dette totale fournisseurs
- Versements du jour

## 🛠️ Technologies

- **Backend**: Node.js, Express.js
- **Base de données**: MySQL avec Prisma ORM
- **Authentification**: JWT
- **Documentation**: Swagger/OpenAPI
- **Sécurité**: Helmet, CORS, Rate Limiting

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

## 🔧 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd Quincaillerie
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```
Modifier le fichier `.env` avec vos informations de base de données :
```env
DATABASE_URL="mysql://user:password@localhost:3306/quincaillerie"
JWT_SECRET="votre_secret_key_tres_securise"
PORT=3000
NODE_ENV=development
```

4. **Générer le client Prisma**
```bash
npm run prisma:generate
```

5. **Migrer la base de données**
```bash
npm run prisma:migrate
```

6. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📁 Structure du Projet

```
Quincaillerie/
├── src/
│   ├── config/         # Configuration (DB, etc.)
│   ├── controllers/    # Contrôleurs API
│   ├── services/       # Logique métier
│   ├── middlewares/    # Middlewares (auth, validation)
│   ├── utils/          # Fonctions utilitaires
│   ├── exceptions/     # Gestion des exceptions
│   ├── responses/      # Réponses standardisées
│   └── app.js          # Point d'entrée
├── prisma/
│   └── schema.prisma   # Schéma de base de données
├── uploads/            # Fichiers uploadés
└── .env                # Variables d'environnement
```

## 🗄️ Modèle de Données

### Entités Principales
- **Utilisateurs** : Gestion des comptes avec rôles
- **Catégories/Sous-catégories** : Organisation des produits
- **Produits** : Articles de la quincaillerie
- **Fournisseurs** : Partenaires commerciaux
- **Commandes** : Commandes fournisseurs
- **Paiements** : Versements des commandes

### Relations
- Rôles → Utilisateurs (1:N)
- Catégories → Sous-catégories (1:N)
- Sous-catégories → Produits (1:N)
- Fournisseurs → Commandes (1:N)
- Commandes → LigneCommandes (1:N)
- Commandes → Paiements (1:N)

## 🔑 Règles Métier

- Maximum 3 versements par commande
- Délai de 5 jours entre chaque versement
- Pas de paiement avant livraison réelle
- Archivage logique (pas de suppression)

## 📚 API Documentation

L'API est documentée avec Swagger et accessible à :
```
http://localhost:3000/api-docs
```

## 🧪 Scripts Disponibles

```bash
npm run dev              # Démarrage en mode développement
npm start               # Démarrage en mode production
npm run prisma:generate # Générer le client Prisma
npm run prisma:migrate  # Migrer la base de données
npm run prisma:studio   # Ouvrir Prisma Studio
```

## 🔒 Sécurité

- Authentification JWT
- Validation des données
- Rate limiting
- Headers de sécurité (Helmet)
- CORS configuré
- Gestion des erreurs sécurisée

## 📝 Licence

ISC

## 👥 Auteur

Développé pour la gestion de quincaillerie # Quincaillerie
