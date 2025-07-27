import { Router } from 'express';
import PaiementController from '../controllers/PaiementController.js';
import { authorizeRole } from '../middlewares/authRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Paiements
 *   description: Gestion des paiements de commandes
 */

/**
 * @swagger
 * /api/paiements:
 *   post:
 *     summary: Enregistrer un paiement pour une commande
 *     tags: [Paiements]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commandeId
 *               - montant
 *             properties:
 *               commandeId:
 *                 type: integer
 *               montant:
 *                 type: number
 *     responses:
 *       201:
 *         description: Paiement enregistré avec succès
 *       400:
 *         description: Règle métier violée
 */
router.post('/', authorizeRole('Responsable Paiement'), PaiementController.enregistrer);

/**
 * @swagger
 * /api/paiements/commande/{commandeId}:
 *   get:
 *     summary: Historique des paiements d'une commande
 *     tags: [Paiements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: commandeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historique des paiements
 */
router.get('/commande/:commandeId', authorizeRole('Responsable Paiement'), PaiementController.getByCommande);

/**
 * @swagger
 * /api/paiements:
 *   get:
 *     summary: Lister tous les paiements (filtrable par date)
 *     tags: [Paiements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: dateDebut
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début (YYYY-MM-DD)
 *       - in: query
 *         name: dateFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste des paiements
 */
router.get('/', authorizeRole('Responsable Paiement'), PaiementController.getAll);

/**
 * @swagger
 * /api/paiements/attente:
 *   get:
 *     summary: Lister les commandes en attente de paiement
 *     tags: [Paiements]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Commandes en attente de paiement
 */
router.get('/attente', authorizeRole('Responsable Paiement'), PaiementController.getCommandesEnAttente);

/**
 * @swagger
 * /api/paiements/commande/{commandeId}/reste:
 *   get:
 *     summary: Voir le montant restant dû sur une commande
 *     tags: [Paiements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: commandeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Montant restant dû
 */
router.get('/commande/:commandeId/reste', authorizeRole('Responsable Paiement'), PaiementController.getMontantRestantCommande);

/**
 * @swagger
 * /api/paiements/fournisseur/{fournisseurId}/dette:
 *   get:
 *     summary: Voir la dette totale d'un fournisseur
 *     tags: [Paiements]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: fournisseurId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dette totale du fournisseur
 */
router.get('/fournisseur/:fournisseurId/dette', authorizeRole('Responsable Paiement'), PaiementController.getDetteFournisseur);

export default router; 