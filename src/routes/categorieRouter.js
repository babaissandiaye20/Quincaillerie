import { Router } from 'express';
import CategorieController from '../controllers/CategorieController.js';
import { authorizeRole } from '../middlewares/authRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Catégories
 *   description: Gestion des catégories de produits
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     tags: [Catégories]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *       409:
 *         description: Conflit, nom déjà utilisé
 */
router.post('/', authorizeRole('Gestionnaire'), CategorieController.create);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Liste toutes les catégories
 *     tags: [Catégories]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des catégories
 */
router.get('/', authorizeRole('Gestionnaire'), CategorieController.getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Récupère une catégorie par son ID
 *     tags: [Catégories]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail de la catégorie
 *       404:
 *         description: Catégorie non trouvée
 */
router.get('/:id', authorizeRole('Gestionnaire'), CategorieController.getById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Met à jour une catégorie
 *     tags: [Catégories]
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
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *       404:
 *         description: Catégorie non trouvée
 */
router.put('/:id', authorizeRole('Gestionnaire'), CategorieController.update);

/**
 * @swagger
 * /api/categories/{id}/archive:
 *   patch:
 *     summary: Archiver (désactiver) une catégorie
 *     tags: [Catégories]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Catégorie archivée
 *       404:
 *         description: Catégorie non trouvée
 */
router.patch('/:id/archive', authorizeRole('Gestionnaire'), CategorieController.archive);

export default router; 