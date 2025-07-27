import ProduitService from '../services/ProduitService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validateProduitDto } from '../dto/produit.dto.js';
import { uploadSingle } from '../upload/cloudinaryService.js';
import { ValidationException } from '../exceptions/AppException.js';

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4 Mo

export default class ProduitController {
  static async create(req, res, next) {
    try {
      const data = { ...req.body };
      console.log('BODY:', data);
      // Trim et conversion des champs
      data.nom = typeof data.nom === 'string' ? data.nom.trim() : '';
      data.description = typeof data.description === 'string' ? data.description.trim() : '';
      data.prix = parseFloat(data.prix);
      data.stock = parseInt(data.stock);
      data.sousCategorieId = parseInt(data.sousCategorieId);
      data.fournisseurId = parseInt(data.fournisseurId);
      // Vérification taille image
      if (req.file) {
        if (req.file.size > MAX_IMAGE_SIZE) {
          throw new ValidationException('L\'image ne doit pas dépasser 4 Mo.');
        }
        const result = await uploadSingle(req.file, 'products');
        data.imagePath = result.url;
      }
      validateProduitDto(data);
      const produit = await ProduitService.createProduit(data);
      return ApiResponse.created(res, produit, 'Produit créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const produits = await ProduitService.getAllProduits();
      return ApiResponse.success(res, produits, 'Liste des produits');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const produit = await ProduitService.getProduitById(req.params.id);
      return ApiResponse.success(res, produit, 'Détail du produit');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = { ...req.body };
      data.nom = typeof data.nom === 'string' ? data.nom.trim() : '';
      data.description = typeof data.description === 'string' ? data.description.trim() : '';
      if (data.prix) data.prix = parseFloat(data.prix);
      if (data.stock) data.stock = parseInt(data.stock);
      if (data.sousCategorieId) data.sousCategorieId = parseInt(data.sousCategorieId);
      if (data.fournisseurId) data.fournisseurId = parseInt(data.fournisseurId);
      if (req.file) {
        if (req.file.size > MAX_IMAGE_SIZE) {
          throw new ValidationException('L\'image ne doit pas dépasser 4 Mo.');
        }
        const result = await uploadSingle(req.file, 'products');
        data.imagePath = result.url;
      }
      validateProduitDto({ ...data, prix: data.prix, stock: data.stock, sousCategorieId: data.sousCategorieId, fournisseurId: data.fournisseurId });
      const produit = await ProduitService.updateProduit(req.params.id, data);
      return ApiResponse.success(res, produit, 'Produit mis à jour');
    } catch (error) {
      next(error);
    }
  }

  static async archive(req, res, next) {
    try {
      const produit = await ProduitService.archiveProduit(req.params.id);
      return ApiResponse.success(res, produit, 'Produit archivé');
    } catch (error) {
      next(error);
    }
  }
} 