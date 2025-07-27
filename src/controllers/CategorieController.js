import CategorieService from '../services/CategorieService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validateCategorieDto } from '../dto/categorie.dto.js';

export default class CategorieController {
  static async create(req, res, next) {
    try {
      validateCategorieDto(req.body);
      const categorie = await CategorieService.createCategorie(req.body);
      return ApiResponse.created(res, categorie, 'Catégorie créée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const categories = await CategorieService.getAllCategories();
      return ApiResponse.success(res, categories, 'Liste des catégories');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const categorie = await CategorieService.getCategorieById(req.params.id);
      return ApiResponse.success(res, categorie, 'Détail de la catégorie');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      validateCategorieDto(req.body);
      const categorie = await CategorieService.updateCategorie(req.params.id, req.body);
      return ApiResponse.success(res, categorie, 'Catégorie mise à jour');
    } catch (error) {
      next(error);
    }
  }

  static async archive(req, res, next) {
    try {
      const categorie = await CategorieService.archiveCategorie(req.params.id);
      return ApiResponse.success(res, categorie, 'Catégorie archivée');
    } catch (error) {
      next(error);
    }
  }
} 