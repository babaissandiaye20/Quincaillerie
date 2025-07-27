import AuthService from '../services/AuthService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validateAuthDto } from '../dto/auth.dto.js';

export default class AuthController {
  static async login(req, res, next) {
    try {
      validateAuthDto(req.body);
      const result = await AuthService.login(req.body);
      return ApiResponse.success(res, result, 'Connexion réussie');
    } catch (error) {
      next(error);
    }
  }
} 