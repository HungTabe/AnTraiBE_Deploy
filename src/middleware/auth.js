"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireFarmer = exports.requireExpert = exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("./errorHandler");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            throw (0, errorHandler_1.createError)('Access token required', 401);
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
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
            throw (0, errorHandler_1.createError)('User not found', 401);
        }
        if (user.status !== 'ACTIVE') {
            throw (0, errorHandler_1.createError)('Account is inactive', 401);
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw (0, errorHandler_1.createError)('Invalid token', 401);
        }
        else if (error.name === 'TokenExpiredError') {
            throw (0, errorHandler_1.createError)('Token expired', 401);
        }
        logger_1.logger.error('Authentication error:', error);
        throw error;
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw (0, errorHandler_1.createError)('Authentication required', 401);
        }
        if (!roles.includes(req.user.role)) {
            throw (0, errorHandler_1.createError)('Insufficient permissions', 403);
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(['ADMIN']);
exports.requireExpert = (0, exports.requireRole)(['EXPERT', 'ADMIN']);
exports.requireFarmer = (0, exports.requireRole)(['FARMER', 'EXPERT', 'ADMIN']);
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return next();
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
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
    }
    catch (error) {
        // For optional auth, we don't throw errors, just continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map