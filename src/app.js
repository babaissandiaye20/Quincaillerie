import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import roleRouter from './routes/roleRouter.js';
import userRouter from './routes/userRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import authRouter from './routes/authRouter.js';
import fournisseurRouter from './routes/fournisseurRouter.js';
import categorieRouter from './routes/categorieRouter.js';
import sousCategorieRouter from './routes/sousCategorieRouter.js';
import produitRouter from './routes/produitRouter.js';
import commandeRouter from './routes/commandeRouter.js';
import paiementRouter from './routes/paiementRouter.js';
import statistiquesRouter from './routes/statistiquesRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'https://quincaillerie-latest.onrender.com',
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use(limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Routes de base
app.get('/', (req, res) => {
  res.json({
    message: 'API Quincaillerie - Système de gestion',
    version: '1.0.0',
    status: 'running'
  });
});

// Router rôles
app.use('/api/roles', roleRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/fournisseurs', fournisseurRouter);
app.use('/api/categories', categorieRouter);
app.use('/api/sous-categories', sousCategorieRouter);
app.use('/api/produits', produitRouter);
app.use('/api/commandes', commandeRouter);
app.use('/api/paiements', paiementRouter);
app.use('/api/statistiques', statistiquesRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

export default app; 