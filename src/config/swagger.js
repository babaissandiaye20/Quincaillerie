import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Quincaillerie',
    version: '1.0.0',
    description: 'Documentation de l’API de gestion de quincaillerie',
    contact: {
      name: 'Barro et frère',
      email: 'contact@quincaillerie.com',
    },
  },
  servers: [
    {
      url: 'https://quincaillerie-latest.onrender.com',
      description: 'Serveur Render (production)',
    },
    {
      url: 'http://localhost:3000',
      description: 'Serveur local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Role: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Gestionnaire' },
          description: { type: 'string', example: 'Peut gérer les catégories et produits' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Utilisateur: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', example: 'user@email.com' },
          nom: { type: 'string', example: 'Barro' },
          prenom: { type: 'string', example: 'Issa' },
          isActive: { type: 'boolean', example: true },
          roleId: { type: 'integer', example: 1 },
          role: { $ref: '#/components/schemas/Role' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Categorie: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nom: { type: 'string', example: 'Fer' },
          description: { type: 'string', example: 'Catégorie de fers' },
          isArchived: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      SousCategorie: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nom: { type: 'string', example: 'Fer de 8' },
          description: { type: 'string', example: 'Sous-catégorie de fers' },
          categorieId: { type: 'integer', example: 1 },
          isArchived: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Produit: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nom: { type: 'string', example: 'Fer de 8 - barre' },
          description: { type: 'string', example: 'Barre de fer de 8mm' },
          prix: { type: 'number', example: 3500 },
          stock: { type: 'integer', example: 100 },
          imagePath: { type: 'string', example: '/uploads/fer8.jpg' },
          sousCategorieId: { type: 'integer', example: 1 },
          isArchived: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Fournisseur: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          numero: { type: 'string', example: 'F001' },
          nom: { type: 'string', example: 'Fournisseur A' },
          email: { type: 'string', example: 'fournisseur@email.com' },
          telephone: { type: 'string', example: '771234567' },
          adresse: { type: 'string', example: 'Dakar' },
          isArchived: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 