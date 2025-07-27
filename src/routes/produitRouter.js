import { Router } from 'express';
import ProduitController from '../controllers/ProduitController.js';
import { authorizeRole } from '../middlewares/authRole.js';
import multer from 'multer';

const upload = multer();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /api/produits:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Produits]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prix
 *               - stock
 *               - sousCategorieId
 *               - fournisseurId
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               stock:
 *                 type: integer
 *               sousCategorieId:
 *                 type: integer
 *               fournisseurId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       409:
 *         description: Conflit, nom déjà utilisé
 */
router.post('/', authorizeRole('Gestionnaire'), upload.single('image'), ProduitController.create);

/**
 * @swagger
 * /api/produits:
 *   get:
 *     summary: Liste tous les produits
 *     tags: [Produits]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get('/', authorizeRole('Gestionnaire'), ProduitController.getAll);

/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     summary: Récupère un produit par son ID
 *     tags: [Produits]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail du produit
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', authorizeRole('Gestionnaire'), ProduitController.getById);

/**
 * @swagger
 * /api/produits/{id}:
 *   put:
 *     summary: Met à jour un produit
 *     tags: [Produits]
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
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               stock:
 *                 type: integer
 *               sousCategorieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       404:
 *         description: Produit non trouvé
 */
router.put('/:id', authorizeRole('Gestionnaire'), upload.single('image'), ProduitController.update);

/**
 * @swagger
 * /api/produits/{id}/archive:
 *   patch:
 *     summary: Archiver (désactiver) un produit
 *     tags: [Produits]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produit archivé
 *       404:
 *         description: Produit non trouvé
 */
router.patch('/:id/archive', authorizeRole('Gestionnaire'), ProduitController.archive);

export default router; 