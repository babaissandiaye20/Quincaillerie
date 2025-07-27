import { ValidationException } from '../exceptions/AppException.js';

export function validateAuthDto(data) {
  if (!data || typeof data !== 'object') {
    throw new ValidationException('Aucune donnée reçue.');
  }
  if (!data.email || typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email)) {
    throw new ValidationException('Un email valide est requis.');
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    throw new ValidationException('Le mot de passe est requis et doit contenir au moins 6 caractères.');
  }
} 