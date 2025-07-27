import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException, BusinessRuleException } from '../exceptions/AppException.js';

export default class ProduitService {
  static async createProduit(data) {
    // Vérifier que la sous-catégorie existe et n'est pas archivée
    const sousCategorie = await prisma.sousCategorie.findUnique({ where: { id: data.sousCategorieId } });
    if (!sousCategorie || sousCategorie.isArchived) {
      throw new BusinessRuleException('Impossible d\'ajouter un produit à une sous-catégorie archivée ou inexistante.');
    }
    // Vérifier que le fournisseur existe et est actif
    const fournisseur = await prisma.fournisseur.findUnique({ where: { id: data.fournisseurId } });
    if (!fournisseur || fournisseur.isArchived) {
      throw new BusinessRuleException('Impossible d\'associer à un fournisseur archivé ou inexistant.');
    }
    // Vérifier unicité du nom parmi les produits actifs de la même sous-catégorie
    // (isArchived: false)
    const existing = await prisma.produit.findFirst({
      where: {
        nom: data.nom,
        sousCategorieId: data.sousCategorieId,
        isArchived: false
      }
    });
    if (existing) {
      throw new ConflictException('Il existe déjà un produit actif avec ce nom dans cette sous-catégorie.');
    }
    return await prisma.produit.create({ data });
  }

  static async getAllProduits() {
    // Retourner uniquement les produits non archivés
    return await prisma.produit.findMany({ where: { isArchived: false } });
  }

  static async getProduitById(id) {
    const produit = await prisma.produit.findUnique({ where: { id: Number(id) } });
    if (!produit || produit.isArchived) throw new NotFoundException('Produit non trouvé');
    return produit;
  }

  static async updateProduit(id, data) {
    // Si on veut changer la sous-catégorie, vérifier qu'elle existe et n'est pas archivée
    if (data.sousCategorieId) {
      const sousCategorie = await prisma.sousCategorie.findUnique({ where: { id: data.sousCategorieId } });
      if (!sousCategorie || sousCategorie.isArchived) {
        throw new BusinessRuleException('Impossible d\'associer à une sous-catégorie archivée ou inexistante.');
      }
    }
    // Si on veut changer le fournisseur, vérifier qu'il existe et est actif
    if (data.fournisseurId) {
      const fournisseur = await prisma.fournisseur.findUnique({ where: { id: data.fournisseurId } });
      if (!fournisseur || fournisseur.isArchived) {
        throw new BusinessRuleException('Impossible d\'associer à un fournisseur archivé ou inexistant.');
      }
    }
    // Vérifier unicité du nom parmi les produits actifs de la même sous-catégorie (hors soi-même)
    if (data.nom || data.sousCategorieId) {
      const produit = await prisma.produit.findUnique({ where: { id: Number(id) } });
      const nom = data.nom || produit.nom;
      const sousCategorieId = data.sousCategorieId || produit.sousCategorieId;
      const existing = await prisma.produit.findFirst({
        where: {
          nom,
          sousCategorieId,
          isArchived: false,
          NOT: { id: Number(id) }
        }
      });
      if (existing) {
        throw new ConflictException('Il existe déjà un produit actif avec ce nom dans cette sous-catégorie.');
      }
    }
    try {
      const produit = await prisma.produit.update({ where: { id: Number(id) }, data });
      return produit;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Produit non trouvé');
      throw new ValidationException(error.message);
    }
  }

  static async archiveProduit(id) {
    try {
      const produit = await prisma.produit.update({ where: { id: Number(id) }, data: { isArchived: true } });
      return produit;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Produit non trouvé');
      throw new ValidationException(error.message);
    }
  }
} 