import { Router } from 'express';
import SousCategorieController from '../controllers/SousCategorieController.js';
import { authorizeRole } from '../middlewares/authRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sous-catégories
 *   description: Gestion des sous-catégories de produits
 */

/**
 * @swagger
 * /api/sous-categories:
 *   post:
 *     summary: Créer une nouvelle sous-catégorie
 *     tags: [Sous-catégories]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - categorieId
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               categorieId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sous-catégorie créée avec succès
 *       400:
 *         description: Catégorie archivée ou inexistante
 */
router.post('/', authorizeRole('Gestionnaire'), SousCategorieController.create);

/**
 * @swagger
 * /api/sous-categories:
 *   get:
 *     summary: Liste toutes les sous-catégories
 *     tags: [Sous-catégories]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des sous-catégories
 */
router.get('/', authorizeRole('Gestionnaire'), SousCategorieController.getAll);

/**
 * @swagger
 * /api/sous-categories/{id}:
 *   get:
 *     summary: Récupère une sous-catégorie par son ID
 *     tags: [Sous-catégories]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail de la sous-catégorie
 *       404:
 *         description: Sous-catégorie non trouvée
 */
router.get('/:id', authorizeRole('Gestionnaire'), SousCategorieController.getById);

/**
 * @swagger
 * /api/sous-categories/{id}:
 *   put:
 *     summary: Met à jour une sous-catégorie
 *     tags: [Sous-catégories]
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
 *               categorieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sous-catégorie mise à jour
 *       404:
 *         description: Sous-catégorie non trouvée
 */
router.put('/:id', authorizeRole('Gestionnaire'), SousCategorieController.update);

/**
 * @swagger
 * /api/sous-categories/{id}/archive:
 *   patch:
 *     summary: Archiver (désactiver) une sous-catégorie
 *     tags: [Sous-catégories]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sous-catégorie archivée
 *       404:
 *         description: Sous-catégorie non trouvée
 */
router.patch('/:id/archive', authorizeRole('Gestionnaire'), SousCategorieController.archive);

export default router; 