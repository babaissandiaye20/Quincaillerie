import ApiResponse from '../responses/ApiResponse.js';
import { AppException } from '../exceptions/AppException.js';

const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Si c'est une exception personnalisée, le code status est transmis
  if (err instanceof AppException) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.errors
    );
  }

  // Erreurs de validation Prisma
  if (err.code === 'P2002') {
    return ApiResponse.conflict(
      res,
      'Une ressource avec ces données existe déjà',
      { field: err.meta?.target?.[0] || 'unknown' }
    );
  }

  if (err.code === 'P2025') {
    return ApiResponse.notFound(res, 'Ressource non trouvée');
  }

  if (err.code === 'P2003') {
    return ApiResponse.badRequest(
      res,
      'Violation de contrainte de clé étrangère',
      { field: err.meta?.field_name || 'unknown' }
    );
  }

  // Erreurs de validation Express
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return ApiResponse.validationError(res, errors);
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Token invalide');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token expiré');
  }

  // Erreurs de syntaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ApiResponse.badRequest(res, 'JSON invalide');
  }

  // Erreur par défaut
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Erreur interne du serveur';

  const error = process.env.NODE_ENV === 'development' ? err : {};

  // Le code status par défaut est 500 ici
  return ApiResponse.error(res, message, 500, error);
};

export default errorHandler; 