import { prisma } from '../config/database.js';
import { NotFoundException, ConflictException, ValidationException } from '../exceptions/AppException.js';
import bcrypt from 'bcryptjs';

export default class UserService {
  static async createUser(data) {
    // Vérifier que le rôle existe
    const role = await prisma.role.findUnique({ where: { id: data.roleId } });
    if (!role) throw new ValidationException('Le rôle spécifié n\'existe pas.');

    // Vérifier unicité de l'email
    const existing = await prisma.utilisateur.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Cet email est déjà utilisé.');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Créer l'utilisateur
    const user = await prisma.utilisateur.create({
      data: {
        email: data.email,
        password: hashedPassword,
        nom: data.nom,
        prenom: data.prenom,
        roleId: data.roleId,
        isActive: data.isActive !== undefined ? data.isActive : true
      },
      include: { role: true }
    });
    return user;
  }

  static async getAllUsers() {
    return await prisma.utilisateur.findMany({ include: { role: true } });
  }

  static async getUserById(id) {
    const user = await prisma.utilisateur.findUnique({ where: { id: Number(id) }, include: { role: true } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  static async updateUser(id, data) {
    // Si on veut changer le rôle, vérifier qu'il existe
    if (data.roleId) {
      const role = await prisma.role.findUnique({ where: { id: data.roleId } });
      if (!role) throw new ValidationException('Le rôle spécifié n\'existe pas.');
    }
    // Si on veut changer l'email, vérifier unicité
    if (data.email) {
      const existing = await prisma.utilisateur.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== Number(id)) throw new ConflictException('Cet email est déjà utilisé.');
    }
    // Si on veut changer le mot de passe, le hasher
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    try {
      const user = await prisma.utilisateur.update({
        where: { id: Number(id) },
        data,
        include: { role: true }
      });
      return user;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Utilisateur non trouvé');
      throw new ValidationException(error.message);
    }
  }

  static async deleteUser(id) {
    try {
      await prisma.utilisateur.delete({ where: { id: Number(id) } });
      return true;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Utilisateur non trouvé');
      throw new ValidationException(error.message);
    }
  }
} 