import SousCategorieService from '../services/SousCategorieService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validateSousCategorieDto } from '../dto/sousCategorie.dto.js';

export default class SousCategorieController {
  static async create(req, res, next) {
    try {
      validateSousCategorieDto(req.body);
      const sousCategorie = await SousCategorieService.createSousCategorie(req.body);
      return ApiResponse.created(res, sousCategorie, 'Sous-catégorie créée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const sousCategories = await SousCategorieService.getAllSousCategories();
      return ApiResponse.success(res, sousCategories, 'Liste des sous-catégories');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const sousCategorie = await SousCategorieService.getSousCategorieById(req.params.id);
      return ApiResponse.success(res, sousCategorie, 'Détail de la sous-catégorie');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      validateSousCategorieDto(req.body);
      const sousCategorie = await SousCategorieService.updateSousCategorie(req.params.id, req.body);
      return ApiResponse.success(res, sousCategorie, 'Sous-catégorie mise à jour');
    } catch (error) {
      next(error);
    }
  }

  static async archive(req, res, next) {
    try {
      const sousCategorie = await SousCategorieService.archiveSousCategorie(req.params.id);
      return ApiResponse.success(res, sousCategorie, 'Sous-catégorie archivée');
    } catch (error) {
      next(error);
    }
  }
} 