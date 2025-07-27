import { ValidationException } from '../exceptions/AppException.js';

export function validateSousCategorieDto(data) {
  if (!data || typeof data !== 'object') {
    throw new ValidationException('Aucune donnée reçue.');
  }
  if (!data.nom || typeof data.nom !== 'string' || data.nom.trim().length < 2) {
    throw new ValidationException('Le nom de la sous-catégorie est requis et doit contenir au moins 2 caractères.');
  }
  if (data.description && typeof data.description !== 'string') {
    throw new ValidationException('La description doit être une chaîne de caractères.');
  }
  if (!data.categorieId || typeof data.categorieId !== 'number' || data.categorieId <= 0) {
    throw new ValidationException('Un categorieId valide est requis.');
  }
} 