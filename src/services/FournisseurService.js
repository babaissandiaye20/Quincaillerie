import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException } from '../exceptions/AppException.js';

export default class FournisseurService {
  static async createFournisseur(data) {
    // Vérifier unicité du numero
    const existingNumero = await prisma.fournisseur.findFirst({ where: { numero: data.numero } });
    if (existingNumero) throw new ConflictException('Ce numéro de fournisseur existe déjà.');
    // Vérifier unicité du nom
    const existing = await prisma.fournisseur.findFirst({ where: { nom: data.nom } });
    if (existing) throw new ConflictException('Ce nom de fournisseur existe déjà.');
    return await prisma.fournisseur.create({ data });
  }

  static async getAllFournisseurs() {
    // Afficher uniquement les fournisseurs non archivés
    return await prisma.fournisseur.findMany({ where: { isArchived: false } });
  }

  static async getFournisseurById(id) {
    const fournisseur = await prisma.fournisseur.findUnique({ where: { id: Number(id) } });
    if (!fournisseur || fournisseur.isArchived) throw new NotFoundException('Fournisseur non trouvé');
    return fournisseur;
  }

  static async updateFournisseur(id, data) {
    try {
      const fournisseur = await prisma.fournisseur.update({ where: { id: Number(id) }, data });
      return fournisseur;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Fournisseur non trouvé');
      throw new ValidationException(error.message);
    }
  }

  static async archiveFournisseur(id) {
    try {
      const fournisseur = await prisma.fournisseur.update({ where: { id: Number(id) }, data: { isArchived: true } });
      return fournisseur;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Fournisseur non trouvé');
      throw new ValidationException(error.message);
    }
  }

  static async searchFournisseursByProduit(produitId) {
    // Trouver tous les fournisseurs ayant livré un produit donné
    const fournisseurs = await prisma.fournisseur.findMany({
      where: {
        commandes: {
          some: {
            ligneCommandes: {
              some: { produitId: Number(produitId) }
            }
          }
        },
        isArchived: false
      }
    });
    return fournisseurs;
  }
} 