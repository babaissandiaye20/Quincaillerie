# 🏗️ Architecture du projet Quincaillerie

Ce document explique l'architecture technique du projet, pour que tu puisses t'en inspirer et créer une base solide pour n'importe quelle application Node.js/Express moderne.

---

## 1. Vue d'ensemble des dossiers

```
src/
├── app.js              # Point d'entrée principal (Express)
├── config/             # Configuration (base de données, Swagger, etc.)
├── controllers/        # Contrôleurs : reçoivent les requêtes, valident, appellent les services
├── services/           # Logique métier, accès base de données (via Prisma)
├── middlewares/        # Middlewares Express (auth, gestion erreurs, etc.)
├── exceptions/         # Exceptions personnalisées (erreurs métier, validation...)
├── responses/          # Standardisation des réponses API
├── routes/             # Définition des routes Express
├── dto/                # Validation et typage des données (Data Transfer Objects)
├── upload/             # Gestion des fichiers (Cloudinary, etc.)
├── utils/              # Fonctions utilitaires (optionnel)
```

---

## 2. Point d'entrée : `app.js`
- Initialise Express, charge les middlewares de sécurité (Helmet, CORS, rate limiting, morgan).
- Charge les routes principales (`/api/...`).
- Gère les erreurs 404 et les erreurs globales.
- Démarre le serveur.

---

## 3. Configuration (`config/`)
- `database.js` : Initialise Prisma, gère la connexion/fermeture propre à la base de données.
- `swagger.js` : Génère la documentation Swagger à partir des routes.

---

## 4. Middlewares (`middlewares/`)
- `authRole.js` : Vérifie le JWT, contrôle l'accès selon le rôle (ex : Gestionnaire, Responsable Achat, etc.).
- `errorHandler.js` : Centralise la gestion des erreurs (exceptions personnalisées, erreurs Prisma, JWT, etc.).

---

## 5. Exceptions personnalisées (`exceptions/`)
- `AppException.js` : Base pour toutes les erreurs métier/validation.
- Déclinaisons : `ValidationException`, `NotFoundException`, `BusinessRuleException`, etc.

---

## 6. Réponses standardisées (`responses/`)
- `ApiResponse.js` : Fournit des méthodes pour répondre de façon uniforme (succès, erreur, validation, etc.).

---

## 7. DTO & Validation (`dto/`)
- Un fichier par entité (ex : `produit.dto.js`, `commande.dto.js`...)
- Chaque DTO exporte une fonction de validation qui lève une `ValidationException` en cas d'erreur.

---

## 8. Services (`services/`)
- Un service par entité métier (Produit, Commande, Paiement, etc.).
- Toute la logique métier, les règles, et l'accès à la base de données (via Prisma) sont ici.
- Les transactions complexes sont gérées ici (ex : création de commande, paiement fractionné, etc.).

---

## 9. Contrôleurs (`controllers/`)
- Reçoivent la requête, valident les données (via DTO), appellent le service, renvoient la réponse formatée.
- Jamais de logique métier ici !

---

## 10. Routes (`routes/`)
- Un fichier par ressource (produit, commande, paiement, etc.).
- Chaque route applique le middleware d'authentification/autorisation adapté.
- Les routes sont documentées avec Swagger (annotations JSDoc).

---

## 11. Upload (`upload/`)
- `cloudinaryService.js` : Gère l'upload et la suppression de fichiers sur Cloudinary.

---

## 12. Utilitaires (`utils/`)
- Fonctions utilitaires réutilisables (optionnel).

---

## 13. Documentation & Swagger
- Toute l'API est documentée automatiquement via Swagger (`/api-docs`).
- Les schémas, paramètres, et réponses sont décrits dans les routes.

---

## 14. Sécurité
- Authentification JWT obligatoire sur toutes les routes.
- Gestion des rôles pour chaque endpoint.
- Rate limiting, CORS, Helmet pour la sécurité HTTP.
- Validation stricte des données côté backend.

---

## 15. Gestion des erreurs
- Toutes les erreurs sont centralisées et formatées (même structure pour le front).
- Les erreurs métier, validation, accès interdit, etc. sont explicites.

---

## 16. Base de données
- Prisma ORM pour l'accès à la base (MySQL/PostgreSQL).
- Transactions pour les opérations critiques.
- Schéma versionné dans `prisma/schema.prisma`.

---

## 17. Comment réutiliser cette architecture ?
- Clone ce repo, supprime les entités métier, garde la structure des dossiers/fichiers.
- Ajoute tes propres entités, DTO, services, routes, etc.
- Tu as déjà la sécurité, la gestion d'erreur, la validation, la doc, la base de données, etc.

---

**Cette architecture est idéale pour tout projet Node.js/Express nécessitant sécurité, robustesse, et évolutivité.** 