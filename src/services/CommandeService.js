import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException, BusinessRuleException } from '../exceptions/AppException.js';

export default class CommandeService {
  static async createCommande(data) {
    // Transaction pour la création de la commande et des lignes
    return await prisma.$transaction(async (tx) => {
      // Vérifier que le fournisseur existe et est actif
      const fournisseur = await tx.fournisseur.findUnique({ where: { id: data.fournisseurId } });
      if (!fournisseur || fournisseur.isArchived) {
        throw new BusinessRuleException('Fournisseur archivé ou inexistant.');
      }
      // Vérifier chaque ligne (produit actif, quantité <= stock)
      for (const ligne of data.lignes) {
        const produit = await tx.produit.findUnique({ where: { id: ligne.produitId } });
        if (!produit || produit.isArchived) {
          throw new BusinessRuleException('Produit archivé ou inexistant.');
        }
        if (ligne.quantite > produit.stock) {
          throw new BusinessRuleException(`Stock insuffisant pour le produit ${produit.nom}. Stock: ${produit.stock}, demandé: ${ligne.quantite}`);
        }
      }
      // Générer un numéro unique pour la commande
      const now = new Date();
      const numero = `C${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${Date.now()}`;
      // Calculer le montant total à partir des lignes
      const montantTotal = data.lignes.reduce((sum, ligne) => sum + (ligne.quantite * ligne.prixUnitaire), 0);
      // Créer la commande
      const commande = await tx.commande.create({
        data: {
          numero,
          fournisseurId: data.fournisseurId,
          date: data.date ? new Date(data.date) : new Date(),
          montantTotal,
          etat: 'ENCOURS',
          ligneCommandes: {
            create: data.lignes.map(ligne => ({
              produitId: ligne.produitId,
              quantite: ligne.quantite,
              prixUnitaire: ligne.prixUnitaire
            }))
          }
        },
        include: { ligneCommandes: true }
      });
      return commande;
    });
  }

  static async annulerCommande(id) {
    // Transaction pour supprimer la commande et ses lignes si ENCOURS
    return await prisma.$transaction(async (tx) => {
      const commande = await tx.commande.findUnique({ where: { id: Number(id) }, include: { ligneCommandes: true } });
      if (!commande) throw new NotFoundException('Commande non trouvée');
      if (commande.etat !== 'ENCOURS') throw new BusinessRuleException('Seules les commandes ENCOURS peuvent être annulées.');
      // Supprimer les lignes
      await tx.ligneCommande.deleteMany({ where: { commandeId: commande.id } });
      // Supprimer la commande
      await tx.commande.delete({ where: { id: commande.id } });
      return true;
    });
  }

  static async livrerCommande(id) {
    // Transaction pour passer à LIVREE et décrémenter le stock
    return await prisma.$transaction(async (tx) => {
      const commande = await tx.commande.findUnique({ where: { id: Number(id) }, include: { ligneCommandes: true } });
      if (!commande) throw new NotFoundException('Commande non trouvée');
      if (commande.etat !== 'ENCOURS') throw new BusinessRuleException('Seules les commandes ENCOURS peuvent être livrées.');
      // Vérifier le stock pour chaque ligne
      for (const ligne of commande.ligneCommandes) {
        const produit = await tx.produit.findUnique({ where: { id: ligne.produitId } });
        if (!produit || produit.isArchived) throw new BusinessRuleException('Produit archivé ou inexistant.');
        if (ligne.quantite > produit.stock) {
          throw new BusinessRuleException(`Stock insuffisant pour le produit ${produit.nom}. Stock: ${produit.stock}, demandé: ${ligne.quantite}`);
        }
      }
      // Décrémenter le stock
      for (const ligne of commande.ligneCommandes) {
        await tx.produit.update({
          where: { id: ligne.produitId },
          data: { stock: { decrement: ligne.quantite } }
        });
      }
      // Mettre à jour le statut
      const updated = await tx.commande.update({
        where: { id: commande.id },
        data: { etat: 'LIVRE' },
        include: { ligneCommandes: true }
      });
      return updated;
    });
  }

  static async getCommandes({ dateDebut, dateFin, etat }) {
    const where = {};
    if (etat) where.etat = etat;
    if (dateDebut || dateFin) {
      where.date = {};
      if (dateDebut) where.date.gte = new Date(dateDebut);
      if (dateFin) where.date.lte = new Date(dateFin);
    }
    return await prisma.commande.findMany({
      where,
      include: {
        fournisseur: true,
        ligneCommandes: true
      },
      orderBy: { date: 'desc' }
    });
  }

  // ... autres méthodes (filtrage, changement d'état, etc.) ...
} 