import { Router } from 'express';
import RoleController from '../controllers/RoleController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Rôles
 *   description: Gestion des rôles utilisateurs
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Créer un nouveau rôle
 *     tags: [Rôles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rôle créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       409:
 *         description: Conflit, nom déjà utilisé
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Liste tous les rôles
 *     tags: [Rôles]
 *     responses:
 *       200:
 *         description: Liste des rôles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Récupère un rôle par son ID
 *     tags: [Rôles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail du rôle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rôle non trouvé
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Met à jour un rôle
 *     tags: [Rôles]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rôle non trouvé
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Supprime un rôle
 *     tags: [Rôles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rôle supprimé
 *       404:
 *         description: Rôle non trouvé
 */

router.post('/', RoleController.create);
router.get('/', RoleController.getAll);
router.get('/:id', RoleController.getById);
router.put('/:id', RoleController.update);
router.delete('/:id', RoleController.delete);

export default router; 