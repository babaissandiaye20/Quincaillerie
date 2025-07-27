import { ValidationException } from '../exceptions/AppException.js';

export function validateRoleDto(data) {
  if (!data || typeof data !== 'object') {
    throw new ValidationException('Aucune donnée reçue.');
  }
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    throw new ValidationException('Le nom du rôle est requis, non nul, doit être une chaîne de caractères et contenir au moins 2 caractères.');
  }
  if (data.description && typeof data.description !== 'string') {
    throw new ValidationException('La description doit être une chaîne de caractères.');
  }
  // L'unicité du nom sera vérifiée dans le service via la base de données
} 