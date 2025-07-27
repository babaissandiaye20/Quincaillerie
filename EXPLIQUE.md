# Documentation technique du projet

## 1. Middlewares

### `authRole.js`
- **But** : Protéger les routes selon le rôle de l'utilisateur.
- **Fonctionnement** :
  - Vérifie la présence et la validité du token JWT dans l'en-tête `Authorization`.
  - Si un rôle est précisé, vérifie que l'utilisateur a bien ce rôle.
  - Si tout est OK, ajoute l'utilisateur décodé à `req.user` et passe au middleware suivant.
  - Sinon, retourne une réponse d'erreur appropriée (401 ou 403).

### `errorHandler.js`
- **But** : Gérer toutes les erreurs de l'application de façon centralisée.
- **Fonctionnement** :
  - Si l'erreur est une exception personnalisée (`AppException`), retourne le message et le code approprié.
  - Gère aussi les erreurs Prisma (conflit, non trouvé, contrainte étrangère), les erreurs de validation, JWT, JSON, etc.
  - En mode développement, affiche le message d'erreur détaillé, sinon un message générique.

---

## 2. Fonctions d'upload

### `cloudinaryService.js`
- **uploadSingle(file, folder)** :  Upload un fichier unique sur Cloudinary dans le dossier spécifié. Retourne l'URL sécurisée et l'ID du fichier.
- **uploadMultiple(files, folder)** :  Upload plusieurs fichiers en parallèle. Retourne un tableau d'URLs/IDs.
- **deleteFile(fileId)** :  Supprime un fichier de Cloudinary via son ID.

---

## 3. Exceptions personnalisées

### `AppException.js`
- **AppException** : Exception de base, contient un message, un code HTTP, des erreurs éventuelles.
- **ValidationException** : Pour les erreurs de validation (422).
- **NotFoundException** : Pour les ressources non trouvées (404).
- **UnauthorizedException** : Pour les accès non autorisés (401).
- **ForbiddenException** : Pour les accès interdits (403).
- **ConflictException** : Pour les conflits de données (409).
- **BusinessRuleException** : Pour les violations de règles métier (400).

---

## 4. Réponses API

### `ApiResponse.js`
- **success** : Réponse standard de succès (200).
- **created** : Réponse pour création (201).
- **noContent** : Réponse sans contenu (204).
- **badRequest, unauthorized, forbidden, notFound, conflict, validationError** : Réponses d'erreur avec le code HTTP adapté.
- **error** : Réponse d'erreur générique (500).

---

## 5. Services (exemples de méthodes)

Chaque service gère la logique métier d'une entité (Commande, Paiement, Produit, etc.) :

- **CommandeService**
  - `createCommande` : Crée une commande, vérifie le stock, calcule le montant total.
  - `annulerCommande` : Annule une commande si elle est en cours.
  - `livrerCommande` : Livre une commande, décrémente le stock.
  - `getCommandes` : Liste/filtre les commandes.

- **PaiementService**
  - `enregistrerPaiement` : Enregistre un paiement, applique les règles métier (max 3, espacement, etc.).
  - `getPaiementsByCommande` : Liste les paiements d'une commande.
  - `getCommandesEnAttentePaiement` : Liste les commandes à payer.
  - `getMontantRestantCommande` : Calcule le reste à payer.
  - `getDetteFournisseur` : Calcule la dette d'un fournisseur.

- **ProduitService, FournisseurService, etc.**
  - Méthodes CRUD classiques (création, modification, archivage, recherche...).

---

## 6. Résumé d'utilisation

- **Middlewares** : Sécurisent et gèrent les erreurs globalement.
- **Upload** : Gère l'envoi et la suppression de fichiers sur Cloudinary.
- **Exceptions** : Permettent de retourner des erreurs claires et structurées.
- **ApiResponse** : Standardise toutes les réponses envoyées au client.
- **Services** : Toute la logique métier, validation, calculs, et accès à la base de données.

---

**Ce schéma permet de maintenir un code propre, sécurisé, et facile à maintenir.** 