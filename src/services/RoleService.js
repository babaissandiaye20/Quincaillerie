import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException } from '../exceptions/AppException.js';

export default class RoleService {
  static async createRole(data) {
    // L'unicité du nom est vérifiée par la base de données (contrainte unique Prisma)
    try {
      return await prisma.role.create({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        // Erreur d'unicité sur le champ 'name'
        throw new ConflictException('Ce nom de rôle existe déjà');
      }
      throw new ValidationException(error.message);
    }
  }

  static async getAllRoles() {
    return await prisma.role.findMany();
  }

  static async getRoleById(id) {
    const role = await prisma.role.findUnique({ where: { id: Number(id) } });
    if (!role) throw new NotFoundException('Rôle non trouvé');
    return role;
  }

  static async updateRole(id, data) {
    // L'unicité du nom est vérifiée par la base de données (contrainte unique Prisma)
    try {
      const role = await prisma.role.update({ where: { id: Number(id) }, data });
      return role;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Rôle non trouvé');
      if (error.code === 'P2002') throw new ConflictException('Ce nom de rôle existe déjà');
      throw new ValidationException(error.message);
    }
  }

  static async deleteRole(id) {
    try {
      await prisma.role.delete({ where: { id: Number(id) } });
      return true;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Rôle non trouvé');
      throw new ValidationException(error.message);
    }
  }
} 