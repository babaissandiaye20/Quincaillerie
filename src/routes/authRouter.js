import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification et génération de token
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentifier un utilisateur et générer un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token et les infos utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         description: Identifiants invalides
 */

router.post('/login', AuthController.login);

export default router; 