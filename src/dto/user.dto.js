import { ValidationException } from '../exceptions/AppException.js';

export function validateUserDto(data) {
  if (!data || typeof data !== 'object') {
    throw new ValidationException('Aucune donnée reçue.');
  }
  if (!data.email || typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email)) {
    throw new ValidationException('Un email valide est requis.');
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    throw new ValidationException('Le mot de passe est requis et doit contenir au moins 6 caractères.');
  }
  if (!data.nom || typeof data.nom !== 'string' || data.nom.trim().length < 2) {
    throw new ValidationException('Le nom est requis et doit contenir au moins 2 caractères.');
  }
  if (!data.prenom || typeof data.prenom !== 'string' || data.prenom.trim().length < 2) {
    throw new ValidationException('Le prénom est requis et doit contenir au moins 2 caractères.');
  }
  if (!data.roleId || typeof data.roleId !== 'number' || data.roleId <= 0) {
    throw new ValidationException('Un roleId valide est requis.');
  }
} 