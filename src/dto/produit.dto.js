import { ValidationException } from '../exceptions/AppException.js';

export function validateProduitDto(data) {
  if (!data || typeof data !== 'object') {
    throw new ValidationException('Aucune donnée reçue.');
  }
  if (!data.nom || typeof data.nom !== 'string' || data.nom.trim().length < 2) {
    throw new ValidationException('Le nom du produit est requis et doit contenir au moins 2 caractères.');
  }
  if (data.description && typeof data.description !== 'string') {
    throw new ValidationException('La description doit être une chaîne de caractères.');
  }
  if (typeof data.prix !== 'number' || data.prix <= 0) {
    throw new ValidationException('Le prix du produit est requis et doit être un nombre positif.');
  }
  if (typeof data.stock !== 'number' || data.stock < 0) {
    throw new ValidationException('Le stock doit être un entier positif ou nul.');
  }
  if (!data.sousCategorieId || typeof data.sousCategorieId !== 'number' || data.sousCategorieId <= 0) {
    throw new ValidationException('Un sousCategorieId valide est requis.');
  }
} 