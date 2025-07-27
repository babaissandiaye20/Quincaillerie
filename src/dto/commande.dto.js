import { ValidationException } from '../exceptions/AppException.js';

export function validateCommandeDto(data) {
  if (!data || typeof data !== 'object') {
    throw new ValidationException('Aucune donnée reçue.');
  }
  if (!data.fournisseurId || typeof data.fournisseurId !== 'number' || data.fournisseurId <= 0) {
    throw new ValidationException('Un fournisseurId valide est requis.');
  }
  if (!Array.isArray(data.lignes) || data.lignes.length === 0) {
    throw new ValidationException('Au moins une ligne de commande est requise.');
  }
  data.lignes.forEach((ligne, i) => {
    if (!ligne.produitId || typeof ligne.produitId !== 'number' || ligne.produitId <= 0) {
      throw new ValidationException(`Ligne ${i + 1} : produitId invalide.`);
    }
    if (typeof ligne.quantite !== 'number' || ligne.quantite <= 0) {
      throw new ValidationException(`Ligne ${i + 1} : quantite invalide.`);
    }
    if (typeof ligne.prixUnitaire !== 'number' || ligne.prixUnitaire <= 0) {
      throw new ValidationException(`Ligne ${i + 1} : prixUnitaire invalide.`);
    }
  });
} 