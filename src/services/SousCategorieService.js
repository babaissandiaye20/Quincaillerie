import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException, BusinessRuleException } from '../exceptions/AppException.js';

export default class SousCategorieService {
  static async createSousCategorie(data) {
    // Vérifier que la catégorie existe et n'est pas archivée
    const categorie = await prisma.categorie.findUnique({ where: { id: data.categorieId } });
    if (!categorie || categorie.isArchived) {
      throw new BusinessRuleException('Impossible d\'ajouter une sous-catégorie à une catégorie archivée ou inexistante.');
    }
    // Vérifier unicité du nom parmi les sous-catégories actives de la même catégorie
    const existing = await prisma.sousCategorie.findFirst({
      where: {
        nom: data.nom,
        categorieId: data.categorieId,
        isArchived: false
      }
    });
    if (existing) {
      throw new ConflictException('Il existe déjà une sous-catégorie active avec ce nom dans cette catégorie.');
    }
    return await prisma.sousCategorie.create({ data });
  }

  static async getAllSousCategories() {
    return await prisma.sousCategorie.findMany({ where: { isArchived: false } });
  }

  static async getSousCategorieById(id) {
    const sousCategorie = await prisma.sousCategorie.findUnique({ where: { id: Number(id) } });
    if (!sousCategorie || sousCategorie.isArchived) throw new NotFoundException('Sous-catégorie non trouvée');
    return sousCategorie;
  }

  static async updateSousCategorie(id, data) {
    // Si on veut changer la catégorie, vérifier qu'elle existe et n'est pas archivée
    if (data.categorieId) {
      const categorie = await prisma.categorie.findUnique({ where: { id: data.categorieId } });
      if (!categorie || categorie.isArchived) {
        throw new BusinessRuleException('Impossible d\'associer à une catégorie archivée ou inexistante.');
      }
    }
    // Vérifier unicité du nom parmi les sous-catégories actives de la même catégorie (hors soi-même)
    if (data.nom || data.categorieId) {
      const sousCategorie = await prisma.sousCategorie.findUnique({ where: { id: Number(id) } });
      const nom = data.nom || sousCategorie.nom;
      const categorieId = data.categorieId || sousCategorie.categorieId;
      const existing = await prisma.sousCategorie.findFirst({
        where: {
          nom,
          categorieId,
          isArchived: false,
          NOT: { id: Number(id) }
        }
      });
      if (existing) {
        throw new ConflictException('Il existe déjà une sous-catégorie active avec ce nom dans cette catégorie.');
      }
    }
    try {
      const sousCategorie = await prisma.sousCategorie.update({ where: { id: Number(id) }, data });
      return sousCategorie;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Sous-catégorie non trouvée');
      throw new ValidationException(error.message);
    }
  }

  static async archiveSousCategorie(id) {
    try {
      const sousCategorie = await prisma.sousCategorie.update({ where: { id: Number(id) }, data: { isArchived: true } });
      return sousCategorie;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Sous-catégorie non trouvée');
      throw new ValidationException(error.message);
    }
  }
} 