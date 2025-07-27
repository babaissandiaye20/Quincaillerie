import { prisma } from '../config/database.js';

export default class StatistiquesService {
  static async getCommandesEnCours() {
    return await prisma.commande.findMany({
      where: { etat: 'ENCOURS' },
      include: { fournisseur: true, ligneCommandes: true }
    });
  }

  static async getCommandesALivrerAujourdhui() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return await prisma.commande.findMany({
      where: {
        date: { gte: today, lt: tomorrow },
        etat: 'ENCOURS'
      },
      include: { fournisseur: true, ligneCommandes: true }
    });
  }

  static async getDetteTotaleQuincaillerie() {
    const commandes = await prisma.commande.findMany({
      include: { paiements: true }
    });
    let dette = 0;
    commandes.forEach(cmd => {
      const totalPaye = cmd.paiements.reduce((sum, p) => sum + p.montant, 0);
      dette += Math.max(cmd.montantTotal - totalPaye, 0);
    });
    return dette;
  }

  static async getVersementsDuJour() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return await prisma.paiement.findMany({
      where: {
        date: { gte: today, lt: tomorrow }
      },
      orderBy: { date: 'desc' }
    });
  }
} 