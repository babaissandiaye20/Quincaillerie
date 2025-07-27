import PaiementService from '../services/PaiementService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validatePaiementDto } from '../dto/paiement.dto.js';

export default class PaiementController {
  static async enregistrer(req, res, next) {
    try {
      validatePaiementDto(req.body);
      const paiement = await PaiementService.enregistrerPaiement(req.body);
      return ApiResponse.created(res, paiement, 'Paiement enregistré avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getByCommande(req, res, next) {
    try {
      const paiements = await PaiementService.getPaiementsByCommande(req.params.commandeId);
      return ApiResponse.success(res, paiements, 'Historique des paiements de la commande');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { dateDebut, dateFin } = req.query;
      const paiements = await PaiementService.getPaiements({ dateDebut, dateFin });
      return ApiResponse.success(res, paiements, 'Liste des paiements');
    } catch (error) {
      next(error);
    }
  }

  static async getCommandesEnAttente(req, res, next) {
    try {
      const commandes = await PaiementService.getCommandesEnAttentePaiement();
      return ApiResponse.success(res, commandes, 'Commandes en attente de paiement');
    } catch (error) {
      next(error);
    }
  }

  static async getMontantRestantCommande(req, res, next) {
    try {
      const montant = await PaiementService.getMontantRestantCommande(req.params.commandeId);
      return ApiResponse.success(res, { montantRestant: montant }, 'Montant restant dû sur la commande');
    } catch (error) {
      next(error);
    }
  }

  static async getDetteFournisseur(req, res, next) {
    try {
      const dette = await PaiementService.getDetteFournisseur(req.params.fournisseurId);
      return ApiResponse.success(res, { detteTotale: dette }, 'Dette totale du fournisseur');
    } catch (error) {
      next(error);
    }
  }
} 