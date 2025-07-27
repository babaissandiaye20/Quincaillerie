import { prisma } from '../config/database.js';
import { UnauthorizedException, ValidationException } from '../exceptions/AppException.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class AuthService {
  static async login({ email, password }) {
    const user = await prisma.utilisateur.findUnique({
      where: { email },
      include: { role: true }
    });
    if (!user) throw new UnauthorizedException('Identifiants invalides.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides.');

    // Générer le token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Ne pas retourner le mot de passe
    const { password: _, ...userData } = user;
    return { token, user: userData };
  }
} 