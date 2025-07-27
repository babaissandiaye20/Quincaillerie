import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException, BusinessRuleException } from '../exceptions/AppException.js';

export default class PaiementService {
  static async enregistrerPaiement(data) {
    return await prisma.$transaction(async (tx) => {
      // Vérifier la commande
      const commande = await tx.commande.findUnique({
        where: { id: data.commandeId },
        include: { paiements: true }
      });
      if (!commande) throw new NotFoundException('Commande non trouvée');
      if (commande.etat !== 'LIVRE') throw new BusinessRuleException('On ne peut payer qu\'une commande livrée.');
      // Max 3 paiements
      if (commande.paiements.length >= 3) throw new BusinessRuleException('Maximum 3 paiements par commande.');
      // Espacement de 5 jours
      if (commande.paiements.length > 0) {
        const lastPaiement = commande.paiements[commande.paiements.length - 1];
        const lastDate = new Date(lastPaiement.date);
        const now = new Date();
        const diff = (now - lastDate) / (1000 * 60 * 60 * 24);
        if (diff < 5) throw new BusinessRuleException('Chaque paiement doit être espacé de 5 jours.');
      }
      // Montant égal (sauf dernier paiement)
      const montantRestant = commande.montantTotal - commande.paiements.reduce((sum, p) => sum + p.montant, 0);
      if (montantRestant <= 0) {
        throw new BusinessRuleException('La commande est déjà totalement payée.');
      }
      const paiementsRestants = 3 - commande.paiements.length;
      const montantAttendu = Math.round((montantRestant / paiementsRestants) * 100) / 100;
      if (paiementsRestants > 1 && Math.abs(data.montant - montantAttendu) > 0.01) {
        throw new BusinessRuleException(`Le montant du paiement doit être égal à ${montantAttendu} (paiement fractionné).`);
      }
      if (data.montant > montantRestant + 0.01) {
        throw new BusinessRuleException('Le montant du paiement dépasse le montant restant dû.');
      }
      // Enregistrer le paiement
      const paiement = await tx.paiement.create({
        data: {
          commandeId: data.commandeId,
          montant: data.montant,
          date: new Date()
        }
      });
      // Si paiement complet, passer la commande à PAYE
      const totalPaye = commande.paiements.reduce((sum, p) => sum + p.montant, 0) + data.montant;
      if (Math.abs(totalPaye - commande.montantTotal) < 0.01) {
        await tx.commande.update({ where: { id: commande.id }, data: { etat: 'PAYE' } });
      }
      return paiement;
    });
  }

  static async getPaiementsByCommande(commandeId) {
    return await prisma.paiement.findMany({
      where: { commandeId: Number(commandeId) },
      orderBy: { date: 'asc' }
    });
  }

  static async getPaiements({ dateDebut, dateFin }) {
    const where = {};
    if (dateDebut || dateFin) {
      where.date = {};
      if (dateDebut) where.date.gte = new Date(dateDebut);
      if (dateFin) where.date.lte = new Date(dateFin);
    }
    return await prisma.paiement.findMany({
      where,
      orderBy: { date: 'desc' }
    });
  }

  static async getCommandesEnAttentePaiement() {
    // Commandes LIVRE ou partiellement payées (montant payé < montant total)
    const commandes = await prisma.commande.findMany({
      where: {
        OR: [
          { etat: 'LIVRE' },
          {
            AND: [
              { etat: 'PAYE' },
              {
                paiements: {
                  some: {}
                }
              },
              {
                montantTotal: { gt: 0 }
              }
            ]
          }
        ]
      },
      include: { paiements: true, fournisseur: true }
    });
    // Filtrer côté JS pour les partiellement payées
    return commandes.filter(cmd => {
      const totalPaye = cmd.paiements.reduce((sum, p) => sum + p.montant, 0);
      return cmd.etat === 'LIVRE' || (cmd.etat === 'PAYE' && totalPaye < cmd.montantTotal);
    });
  }

  static async getMontantRestantCommande(commandeId) {
    const commande = await prisma.commande.findUnique({
      where: { id: Number(commandeId) },
      include: { paiements: true }
    });
    if (!commande) throw new NotFoundException('Commande non trouvée');
    const totalPaye = commande.paiements.reduce((sum, p) => sum + p.montant, 0);
    return Math.max(commande.montantTotal - totalPaye, 0);
  }

  static async getDetteFournisseur(fournisseurId) {
    const commandes = await prisma.commande.findMany({
      where: { fournisseurId: Number(fournisseurId) },
      include: { paiements: true }
    });
    let dette = 0;
    commandes.forEach(cmd => {
      const totalPaye = cmd.paiements.reduce((sum, p) => sum + p.montant, 0);
      dette += Math.max(cmd.montantTotal - totalPaye, 0);
    });
    return dette;
  }

  // ... autres méthodes (liste attente, historique, dette, etc.) ...
} 