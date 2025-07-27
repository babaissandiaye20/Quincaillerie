import StatistiquesService from '../services/StatistiquesService.js';
import ApiResponse from '../responses/ApiResponse.js';

export default class StatistiquesController {
  static async getCommandesEnCours(req, res, next) {
    try {
      const commandes = await StatistiquesService.getCommandesEnCours();
      return ApiResponse.success(res, commandes, 'Commandes en cours');
    } catch (error) {
      next(error);
    }
  }

  static async getCommandesALivrerAujourdhui(req, res, next) {
    try {
      const commandes = await StatistiquesService.getCommandesALivrerAujourdhui();
      return ApiResponse.success(res, commandes, 'Commandes à livrer aujourd\'hui');
    } catch (error) {
      next(error);
    }
  }

  static async getDetteTotale(req, res, next) {
    try {
      const dette = await StatistiquesService.getDetteTotaleQuincaillerie();
      return ApiResponse.success(res, { detteTotale: dette }, 'Dette totale de la quincaillerie');
    } catch (error) {
      next(error);
    }
  }

  static async getVersementsDuJour(req, res, next) {
    try {
      const versements = await StatistiquesService.getVersementsDuJour();
      return ApiResponse.success(res, versements, 'Versements du jour');
    } catch (error) {
      next(error);
    }
  }
} 