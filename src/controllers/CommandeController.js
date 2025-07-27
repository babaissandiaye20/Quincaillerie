import CommandeService from '../services/CommandeService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validateCommandeDto } from '../dto/commande.dto.js';

export default class CommandeController {
  static async create(req, res, next) {
    try {
      validateCommandeDto(req.body);
      const commande = await CommandeService.createCommande(req.body);
      return ApiResponse.created(res, commande, 'Commande créée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async annuler(req, res, next) {
    try {
      await CommandeService.annulerCommande(req.params.id);
      return ApiResponse.success(res, null, 'Commande annulée');
    } catch (error) {
      next(error);
    }
  }

  static async livrer(req, res, next) {
    try {
      const commande = await CommandeService.livrerCommande(req.params.id);
      return ApiResponse.success(res, commande, 'Commande livrée');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { dateDebut, dateFin, etat } = req.query;
      const commandes = await CommandeService.getCommandes({ dateDebut, dateFin, etat });
      return ApiResponse.success(res, commandes, 'Liste des commandes');
    } catch (error) {
      next(error);
    }
  }
} 