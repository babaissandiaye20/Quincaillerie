import RoleService from '../services/RoleService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { validateRoleDto } from '../dto/role.dto.js';

export default class RoleController {
  static async create(req, res, next) {
    try {
      // Validation des données reçues via DTO
      validateRoleDto(req.body);
      const role = await RoleService.createRole(req.body);
      return ApiResponse.created(res, role, 'Rôle créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const roles = await RoleService.getAllRoles();
      return ApiResponse.success(res, roles, 'Liste des rôles');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const role = await RoleService.getRoleById(req.params.id);
      return ApiResponse.success(res, role, 'Détail du rôle');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      // Validation des données reçues via DTO
      validateRoleDto(req.body);
      const role = await RoleService.updateRole(req.params.id, req.body);
      return ApiResponse.success(res, role, 'Rôle mis à jour');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await RoleService.deleteRole(req.params.id);
      return ApiResponse.success(res, null, 'Rôle supprimé');
    } catch (error) {
      next(error);
    }
  }
} 