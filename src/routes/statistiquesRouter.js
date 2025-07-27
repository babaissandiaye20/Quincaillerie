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