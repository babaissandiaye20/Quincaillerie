import { Router } from 'express';
import FournisseurController from '../controllers/FournisseurController.js';
import { authorizeRole } from '../middlewares/authRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Fournisseurs
 *   description: Gestion des fournisseurs
 */

/**
 * @swagger
 * /api/fournisseurs:
 *   post:
 *     summary: Créer un nouveau fournisseur
 *     tags: [Fournisseurs]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fournisseur créé avec succès
 *       409:
 *         description: Conflit, nom déjà utilisé
 */
router.post('/', authorizeRole('Responsable Achat'), FournisseurController.create);

/**
 * @swagger
 * /api/fournisseurs:
 *   get:
 *     summary: Liste tous les fournisseurs
 *     tags: [Fournisseurs]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des fournisseurs
 */
router.get('/', authorizeRole('Responsable Achat'), FournisseurController.getAll);

/**
 * @swagger
 * /api/fournisseurs/{id}:
 *   get:
 *     summary: Récupère un fournisseur par son ID
 *     tags: [Fournisseurs]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail du fournisseur
 *       404:
 *         description: Fournisseur non trouvé
 */
router.get('/:id', authorizeRole('Responsable Achat'), FournisseurController.getById);

/**
 * @swagger
 * /api/fournisseurs/{id}:
 *   put:
 *     summary: Met à jour un fournisseur
 *     tags: [Fournisseurs]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fournisseur mis à jour
 *       404:
 *         description: Fournisseur non trouvé
 */
router.put('/:id', authorizeRole('Responsable Achat'), FournisseurController.update);

/**
 * @swagger
 * /api/fournisseurs/{id}/archive:
 *   patch:
 *     summary: Archiver (désactiver) un fournisseur
 *     tags: [Fournisseurs]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fournisseur archivé
 *       404:
 *         description: Fournisseur non trouvé
 */
router.patch('/:id/archive', authorizeRole('Responsable Achat'), FournisseurController.archive);

/**
 * @swagger
 * /api/fournisseurs/produit/{produitId}:
 *   get:
 *     summary: Chercher les fournisseurs ayant livré un produit
 *     tags: [Fournisseurs]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: produitId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fournisseurs pour ce produit
 */
router.get('/produit/:produitId', authorizeRole('Responsable Achat'), FournisseurController.searchByProduit);

export default router; 