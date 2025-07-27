import UserService from '../services/UserService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validateUserDto } from '../dto/user.dto.js';

export default class UserController {
  static async create(req, res, next) {
    try {
      validateUserDto(req.body);
      const user = await UserService.createUser(req.body);
      return ApiResponse.created(res, user, 'Utilisateur créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      return ApiResponse.success(res, users, 'Liste des utilisateurs');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return ApiResponse.success(res, user, 'Détail de l\'utilisateur');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      // On peut réutiliser le DTO, mais password/email/roleId sont optionnels ici
      const data = { ...req.body };
      if (data.email || data.password || data.nom || data.prenom || data.roleId) {
        // On ne valide que les champs présents
        if (data.email && (typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email))) {
          throw new ValidationException('Un email valide est requis.');
        }
        if (data.password && (typeof data.password !== 'string' || data.password.length < 6)) {
          throw new ValidationException('Le mot de passe doit contenir au moins 6 caractères.');
        }
        if (data.nom && (typeof data.nom !== 'string' || data.nom.trim().length < 2)) {
          throw new ValidationException('Le nom doit contenir au moins 2 caractères.');
        }
        if (data.prenom && (typeof data.prenom !== 'string' || data.prenom.trim().length < 2)) {
          throw new ValidationException('Le prénom doit contenir au moins 2 caractères.');
        }
        if (data.roleId && (typeof data.roleId !== 'number' || data.roleId <= 0)) {
          throw new ValidationException('Un roleId valide est requis.');
        }
      }
      const user = await UserService.updateUser(req.params.id, req.body);
      return ApiResponse.success(res, user, 'Utilisateur mis à jour');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await UserService.deleteUser(req.params.id);
      return ApiResponse.success(res, null, 'Utilisateur supprimé');
    } catch (error) {
      next(error);
    }
  }
} 