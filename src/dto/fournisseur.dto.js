import { ValidationException } from '../exceptions/AppException.js';

export function validateFournisseurDto(data) {
  if (!data || typeof data !== 'object') {
    throw new ValidationException('Aucune donnée reçue.');
  }
  if (!data.numero || typeof data.numero !== 'string' || data.numero.trim().length < 2) {
    throw new ValidationException('Le numéro du fournisseur est requis et doit contenir au moins 2 caractères.');
  }
  if (!data.nom || typeof data.nom !== 'string' || data.nom.trim().length < 2) {
    throw new ValidationException('Le nom du fournisseur est requis et doit contenir au moins 2 caractères.');
  }
  if (data.email && (typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email))) {
    throw new ValidationException('L\'email du fournisseur est invalide.');
  }
  if (data.telephone && typeof data.telephone !== 'string') {
    throw new ValidationException('Le téléphone doit être une chaîne de caractères.');
  }
  if (data.adresse && typeof data.adresse !== 'string') {
    throw new ValidationException('L\'adresse doit être une chaîne de caractères.');
  }
} 