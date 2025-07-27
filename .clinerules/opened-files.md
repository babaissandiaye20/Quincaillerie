# Opened Files
## File Name
ARCHITECTURE.md
## File Content
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
# Opened Files
## File Name
wait-for-it.sh
## File Content
#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

# The MIT License (MIT)
# Copyright (c) 2016-2021 vishnubob

set -e

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--host)
      HOST="$2"
      shift 2
      ;;
    -p|--port)
      PORT="$2"
      shift 2
      ;;
    -t|--timeout)
      TIMEOUT="$2"
      shift 2
      ;;
    -q|--quiet)
      QUIET=1
      shift
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -z "$HOST" || -z "$PORT" ]]; then
  echo "Usage: $0 -h host -p port [-t timeout] [-q]"
  exit 1
fi

for ((i=0;i<TIMEOUT;i++)); do
  if nc -z "$HOST" "$PORT"; then
    [[ $QUIET -ne 1 ]] && echo "Host $HOST:$PORT is available!"
    exit 0
  fi
  sleep 1
  [[ $QUIET -ne 1 ]] && echo "Waiting for $HOST:$PORT... ($((i+1))/$TIMEOUT)"

done

[[ $QUIET -ne 1 ]] && echo "Timeout after $TIMEOUT seconds waiting for $HOST:$PORT"
exit 1 
# Opened Files
## File Name
EXPLIQUE.md
## File Content
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
# Opened Files
## File Name
src/services/PaiementService.js
## File Content
import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException, BusinessRuleException } from '../exceptions/AppException.js';

export default class PaiementService {
  static async enregistrerPaiement(data) {
    return await prisma.$transaction(async (tx) => {
      // Vérifier la commande
      const commande = await tx.commande.findUnique({
        where: { id: data.commandeId },
        include: { paiements: true }
      });
      if (!commande) throw new NotFoundException('Commande non trouvée');
      if (commande.etat !== 'LIVRE') throw new BusinessRuleException('On ne peut payer qu\'une commande livrée.');
      // Max 3 paiements
      if (commande.paiements.length >= 3) throw new BusinessRuleException('Maximum 3 paiements par commande.');
      // Espacement de 5 jours
      if (commande.paiements.length > 0) {
        const lastPaiement = commande.paiements[commande.paiements.length - 1];
        const lastDate = new Date(lastPaiement.date);
        const now = new Date();
        const diff = (now - lastDate) / (1000 * 60 * 60 * 24);
        if (diff < 5) throw new BusinessRuleException('Chaque paiement doit être espacé de 5 jours.');
      }
      // Montant égal (sauf dernier paiement)
      const montantRestant = commande.montantTotal - commande.paiements.reduce((sum, p) => sum + p.montant, 0);
      if (montantRestant <= 0) {
        throw new BusinessRuleException('La commande est déjà totalement payée.');
      }
      const paiementsRestants = 3 - commande.paiements.length;
      const montantAttendu = Math.round((montantRestant / paiementsRestants) * 100) / 100;
      if (paiementsRestants > 1 && Math.abs(data.montant - montantAttendu) > 0.01) {
        throw new BusinessRuleException(`Le montant du paiement doit être égal à ${montantAttendu} (paiement fractionné).`);
      }
      if (data.montant > montantRestant + 0.01) {
        throw new BusinessRuleException('Le montant du paiement dépasse le montant restant dû.');
      }
      // Enregistrer le paiement
      const paiement = await tx.paiement.create({
        data: {
          commandeId: data.commandeId,
          montant: data.montant,
          date: new Date()
        }
      });
      // Si paiement complet, passer la commande à PAYE
      const totalPaye = commande.paiements.reduce((sum, p) => sum + p.montant, 0) + data.montant;
      if (Math.abs(totalPaye - commande.montantTotal) < 0.01) {
        await tx.commande.update({ where: { id: commande.id }, data: { etat: 'PAYE' } });
      }
      return paiement;
    });
  }

  static async getPaiementsByCommande(commandeId) {
    return await prisma.paiement.findMany({
      where: { commandeId: Number(commandeId) },
      orderBy: { date: 'asc' }
    });
  }

  static async getPaiements({ dateDebut, dateFin }) {
    const where = {};
    if (dateDebut || dateFin) {
      where.date = {};
      if (dateDebut) where.date.gte = new Date(dateDebut);
      if (dateFin) where.date.lte = new Date(dateFin);
    }
    return await prisma.paiement.findMany({
      where,
      orderBy: { date: 'desc' }
    });
  }

  static async getCommandesEnAttentePaiement() {
    // Commandes LIVRE ou partiellement payées (montant payé < montant total)
    const commandes = await prisma.commande.findMany({
      where: {
        OR: [
          { etat: 'LIVRE' },
          {
            AND: [
              { etat: 'PAYE' },
              {
                paiements: {
                  some: {}
                }
              },
              {
                montantTotal: { gt: 0 }
              }
            ]
          }
        ]
      },
      include: { paiements: true, fournisseur: true }
    });
    // Filtrer côté JS pour les partiellement payées
    return commandes.filter(cmd => {
      const totalPaye = cmd.paiements.reduce((sum, p) => sum + p.montant, 0);
      return cmd.etat === 'LIVRE' || (cmd.etat === 'PAYE' && totalPaye < cmd.montantTotal);
    });
  }

  static async getMontantRestantCommande(commandeId) {
    const commande = await prisma.commande.findUnique({
      where: { id: Number(commandeId) },
      include: { paiements: true }
    });
    if (!commande) throw new NotFoundException('Commande non trouvée');
    const totalPaye = commande.paiements.reduce((sum, p) => sum + p.montant, 0);
    return Math.max(commande.montantTotal - totalPaye, 0);
  }

  static async getDetteFournisseur(fournisseurId) {
    const commandes = await prisma.commande.findMany({
      where: { fournisseurId: Number(fournisseurId) },
      include: { paiements: true }
    });
    let dette = 0;
    commandes.forEach(cmd => {
      const totalPaye = cmd.paiements.reduce((sum, p) => sum + p.montant, 0);
      dette += Math.max(cmd.montantTotal - totalPaye, 0);
    });
    return dette;
  }

  // ... autres méthodes (liste attente, historique, dette, etc.) ...
} 
# Opened Files
## File Name
src/services/CommandeService.js
## File Content
import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException, BusinessRuleException } from '../exceptions/AppException.js';

export default class CommandeService {
  static async createCommande(data) {
    // Transaction pour la création de la commande et des lignes
    return await prisma.$transaction(async (tx) => {
      // Vérifier que le fournisseur existe et est actif
      const fournisseur = await tx.fournisseur.findUnique({ where: { id: data.fournisseurId } });
      if (!fournisseur || fournisseur.isArchived) {
        throw new BusinessRuleException('Fournisseur archivé ou inexistant.');
      }
      // Vérifier chaque ligne (produit actif, quantité <= stock)
      for (const ligne of data.lignes) {
        const produit = await tx.produit.findUnique({ where: { id: ligne.produitId } });
        if (!produit || produit.isArchived) {
          throw new BusinessRuleException('Produit archivé ou inexistant.');
        }
        if (ligne.quantite > produit.stock) {
          throw new BusinessRuleException(`Stock insuffisant pour le produit ${produit.nom}. Stock: ${produit.stock}, demandé: ${ligne.quantite}`);
        }
      }
      // Générer un numéro unique pour la commande
      const now = new Date();
      const numero = `C${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${Date.now()}`;
      // Calculer le montant total à partir des lignes
      const montantTotal = data.lignes.reduce((sum, ligne) => sum + (ligne.quantite * ligne.prixUnitaire), 0);
      // Créer la commande
      const commande = await tx.commande.create({
        data: {
          numero,
          fournisseurId: data.fournisseurId,
          date: data.date ? new Date(data.date) : new Date(),
          montantTotal,
          etat: 'ENCOURS',
          ligneCommandes: {
            create: data.lignes.map(ligne => ({
              produitId: ligne.produitId,
              quantite: ligne.quantite,
              prixUnitaire: ligne.prixUnitaire
            }))
          }
        },
        include: { ligneCommandes: true }
      });
      return commande;
    });
  }

  static async annulerCommande(id) {
    // Transaction pour supprimer la commande et ses lignes si ENCOURS
    return await prisma.$transaction(async (tx) => {
      const commande = await tx.commande.findUnique({ where: { id: Number(id) }, include: { ligneCommandes: true } });
      if (!commande) throw new NotFoundException('Commande non trouvée');
      if (commande.etat !== 'ENCOURS') throw new BusinessRuleException('Seules les commandes ENCOURS peuvent être annulées.');
      // Supprimer les lignes
      await tx.ligneCommande.deleteMany({ where: { commandeId: commande.id } });
      // Supprimer la commande
      await tx.commande.delete({ where: { id: commande.id } });
      return true;
    });
  }

  static async livrerCommande(id) {
    // Transaction pour passer à LIVREE et décrémenter le stock
    return await prisma.$transaction(async (tx) => {
      const commande = await tx.commande.findUnique({ where: { id: Number(id) }, include: { ligneCommandes: true } });
      if (!commande) throw new NotFoundException('Commande non trouvée');
      if (commande.etat !== 'ENCOURS') throw new BusinessRuleException('Seules les commandes ENCOURS peuvent être livrées.');
      // Vérifier le stock pour chaque ligne
      for (const ligne of commande.ligneCommandes) {
        const produit = await tx.produit.findUnique({ where: { id: ligne.produitId } });
        if (!produit || produit.isArchived) throw new BusinessRuleException('Produit archivé ou inexistant.');
        if (ligne.quantite > produit.stock) {
          throw new BusinessRuleException(`Stock insuffisant pour le produit ${produit.nom}. Stock: ${produit.stock}, demandé: ${ligne.quantite}`);
        }
      }
      // Décrémenter le stock
      for (const ligne of commande.ligneCommandes) {
        await tx.produit.update({
          where: { id: ligne.produitId },
          data: { stock: { decrement: ligne.quantite } }
        });
      }
      // Mettre à jour le statut
      const updated = await tx.commande.update({
        where: { id: commande.id },
        data: { etat: 'LIVRE' },
        include: { ligneCommandes: true }
      });
      return updated;
    });
  }

  static async getCommandes({ dateDebut, dateFin, etat }) {
    const where = {};
    if (etat) where.etat = etat;
    if (dateDebut || dateFin) {
      where.date = {};
      if (dateDebut) where.date.gte = new Date(dateDebut);
      if (dateFin) where.date.lte = new Date(dateFin);
    }
    return await prisma.commande.findMany({
      where,
      include: {
        fournisseur: true,
        ligneCommandes: true
      },
      orderBy: { date: 'desc' }
    });
  }

  // ... autres méthodes (filtrage, changement d'état, etc.) ...
} 
# Opened Files
## File Name
src/routes/statistiquesRouter.js
## File Content
import { Router } from 'express';
import StatistiquesController from '../controllers/StatistiquesController.js';
import { authorizeRole } from '../middlewares/authRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Statistiques
 *   description: Endpoints pour les statistiques de la quincaillerie
 */

/**
 * @swagger
 * /api/statistiques/commandes-encours:
 *   get:
 *     summary: Lister les commandes en cours
 *     tags: [Statistiques]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des commandes en cours
 */
router.get('/commandes-encours', authorizeRole(), StatistiquesController.getCommandesEnCours);

/**
 * @swagger
 * /api/statistiques/commandes-a-livrer-aujourdhui:
 *   get:
 *     summary: Lister les commandes à livrer aujourd'hui
 *     tags: [Statistiques]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des commandes à livrer aujourd'hui
 */
router.get('/commandes-a-livrer-aujourdhui', authorizeRole(), StatistiquesController.getCommandesALivrerAujourdhui);

/**
 * @swagger
 * /api/statistiques/dette-totale:
 *   get:
 *     summary: Afficher la dette totale de la quincaillerie
 *     tags: [Statistiques]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Dette totale de la quincaillerie
 */
router.get('/dette-totale', authorizeRole(), StatistiquesController.getDetteTotale);

/**
 * @swagger
 * /api/statistiques/versements-du-jour:
 *   get:
 *     summary: Afficher les versements effectués dans la journée
 *     tags: [Statistiques]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des versements du jour
 */
router.get('/versements-du-jour', authorizeRole(), StatistiquesController.getVersementsDuJour);

export default router; 
