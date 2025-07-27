import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Fonction pour tester la connexion
export async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
}

// Fonction pour fermer la connexion
export async function closeConnection() {
  await prisma.$disconnect();
  console.log('🔌 Connexion à la base de données fermée');
}

// Gestion de la fermeture propre de l'application
process.on('beforeExit', async () => {
  await closeConnection();
});

process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
}); 