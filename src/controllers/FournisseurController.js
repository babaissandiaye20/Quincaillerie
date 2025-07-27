import FournisseurService from '../services/FournisseurService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validateFournisseurDto } from '../dto/fournisseur.dto.js';

export default class FournisseurController {
  static async create(req, res, next) {
    try {
      validateFournisseurDto(req.body);
      const fournisseur = await FournisseurService.createFournisseur(req.body);
      return ApiResponse.created(res, fournisseur, 'Fournisseur créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const fournisseurs = await FournisseurService.getAllFournisseurs();
      return ApiResponse.success(res, fournisseurs, 'Liste des fournisseurs');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const fournisseur = await FournisseurService.getFournisseurById(req.params.id);
      return ApiResponse.success(res, fournisseur, 'Détail du fournisseur');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      validateFournisseurDto(req.body);
      const fournisseur = await FournisseurService.updateFournisseur(req.params.id, req.body);
      return ApiResponse.success(res, fournisseur, 'Fournisseur mis à jour');
    } catch (error) {
      next(error);
    }
  }

  static async archive(req, res, next) {
    try {
      const fournisseur = await FournisseurService.archiveFournisseur(req.params.id);
      return ApiResponse.success(res, fournisseur, 'Fournisseur archivé');
    } catch (error) {
      next(error);
    }
  }

  static async searchByProduit(req, res, next) {
    try {
      const fournisseurs = await FournisseurService.searchFournisseursByProduit(req.params.produitId);
      return ApiResponse.success(res, fournisseurs, 'Fournisseurs pour ce produit');
    } catch (error) {
      next(error);
    }
  }
} 