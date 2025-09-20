import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createError } from './errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Access token required', 401);
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw createError('User not found', 401);
    }

    if (user.status !== 'ACTIVE') {
      throw createError('Account is inactive', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw createError('Invalid token', 401);
    } else if (error.name === 'TokenExpiredError') {
      throw createError('Token expired', 401);
    }
    
    logger.error('Authentication error:', error);
    throw error;
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw createError('Insufficient permissions', 403);
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN']);
export const requireExpert = requireRole(['EXPERT', 'ADMIN']);
export const requireFarmer = requireRole(['FARMER', 'EXPERT', 'ADMIN']);

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (user && user.status === 'ACTIVE') {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    next();
  } catch (error: any) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};
