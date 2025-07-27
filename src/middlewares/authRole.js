import jwt from 'jsonwebtoken';
import ApiResponse from '../responses/ApiResponse.js';

export function authorizeRole(roleName) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Token manquant');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roleName && decoded.role !== roleName) {
        return ApiResponse.forbidden(res, 'Accès réservé au rôle ' + roleName);
      }
      req.user = decoded;
      next();
    } catch (err) {
      return ApiResponse.unauthorized(res, 'Token invalide ou expiré');
    }
  };
} 