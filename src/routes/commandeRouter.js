import { Router } from 'express';
import CommandeController from '../controllers/CommandeController.js';
import { authorizeRole } from '../middlewares/authRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Commandes
 *   description: Gestion des commandes fournisseurs
 */

/**
 * @swagger
 * /api/commandes:
 *   get:
 *     summary: Lister et filtrer les commandes
 *     tags: [Commandes]
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
 *       - in: query
 *         name: etat
 *         schema:
 *           type: string
 *           enum: [ENCOURS, LIVRE, PAYE, ANNULE]
 *         description: Filtrer par état de la commande
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
router.get('/', authorizeRole('Responsable Achat'), CommandeController.getAll);

/**
 * @swagger
 * /api/commandes:
 *   post:
 *     summary: Créer une nouvelle commande fournisseur
 *     tags: [Commandes]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fournisseurId
 *               - lignes
 *             properties:
 *               fournisseurId:
 *                 type: integer
 *               lignes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - produitId
 *                     - quantite
 *                     - prixUnitaire
 *                   properties:
 *                     produitId:
 *                       type: integer
 *                     quantite:
 *                       type: integer
 *                     prixUnitaire:
 *                       type: number
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Stock insuffisant ou données invalides
 */
router.post('/', authorizeRole('Responsable Achat'), CommandeController.create);

/**
 * @swagger
 * /api/commandes/{id}/annuler:
 *   delete:
 *     summary: Annuler une commande (suppression physique si ENCOURS)
 *     tags: [Commandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande annulée
 *       400:
 *         description: Seules les commandes ENCOURS peuvent être annulées
 */
router.delete('/:id/annuler', authorizeRole('Responsable Achat'), CommandeController.annuler);

/**
 * @swagger
 * /api/commandes/{id}/livrer:
 *   patch:
 *     summary: Passer une commande à LIVREE (décrément du stock)
 *     tags: [Commandes]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande livrée
 *       400:
 *         description: Stock insuffisant ou commande non ENCOURS
 */
router.patch('/:id/livrer', authorizeRole('Responsable Achat'), CommandeController.livrer);

export default router; 