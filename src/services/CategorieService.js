import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException } from '../exceptions/AppException.js';

export default class CategorieService {
  static async createCategorie(data) {
    // Vérifier unicité du nom
    const existing = await prisma.categorie.findFirst({ where: { nom: data.nom } });
    if (existing) throw new ConflictException('Ce nom de catégorie existe déjà.');
    return await prisma.categorie.create({ data });
  }

  static async getAllCategories() {
    return await prisma.categorie.findMany({ where: { isArchived: false } });
  }

  static async getCategorieById(id) {
    const categorie = await prisma.categorie.findUnique({ where: { id: Number(id) } });
    if (!categorie || categorie.isArchived) throw new NotFoundException('Catégorie non trouvée');
    return categorie;
  }

  static async updateCategorie(id, data) {
    try {
      const categorie = await prisma.categorie.update({ where: { id: Number(id) }, data });
      return categorie;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Catégorie non trouvée');
      if (error.code === 'P2002') throw new ConflictException('Ce nom de catégorie existe déjà.');
      throw new ValidationException(error.message);
    }
  }

  static async archiveCategorie(id) {
    try {
      const categorie = await prisma.categorie.update({ where: { id: Number(id) }, data: { isArchived: true } });
      return categorie;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Catégorie non trouvée');
      throw new ValidationException(error.message);
    }
  }
} 