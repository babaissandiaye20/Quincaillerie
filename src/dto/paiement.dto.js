import { ValidationException } from '../exceptions/AppException.js';

export function validatePaiementDto(data) {
  if (!data || typeof data !== 'object') {
    throw new ValidationException('Aucune donnée reçue.');
  }
  if (!data.commandeId || typeof data.commandeId !== 'number' || data.commandeId <= 0) {
    throw new ValidationException('Un commandeId valide est requis.');
  }
  if (typeof data.montant !== 'number' || data.montant <= 0) {
    throw new ValidationException('Le montant du paiement doit être un nombre positif.');
  }
} 
