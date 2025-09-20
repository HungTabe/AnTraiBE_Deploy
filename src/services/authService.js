"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthService {
    prisma;
    jwtSecret;
    jwtExpiresIn;
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    }
    async register(userData) {
        try {
            const { email, password, firstName, lastName, phone, farmName, farmAddress, farmCity, farmProvince } = userData;
            // Check if user already exists
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw (0, errorHandler_1.createError)('User already exists', 409);
            }
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            // Create user and farm in transaction
            const result = await this.prisma.$transaction(async (tx) => {
                // Create user
                const user = await tx.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        firstName,
                        lastName,
                        phone: phone || null,
                        role: 'FARMER',
                        status: 'ACTIVE',
                    },
                });
                // Create farm
                const farm = await tx.farm.create({
                    data: {
                        name: farmName,
                        address: farmAddress,
                        city: farmCity,
                        province: farmProvince,
                        userId: user.id,
                    },
                });
                return { user, farm };
            });
            // Generate JWT token
            const token = this.generateToken(result.user.id);
            logger_1.logger.info(`User registered successfully: ${email}`);
            return {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    phone: result.user.phone,
                    role: result.user.role,
                    status: result.user.status,
                    createdAt: result.user.createdAt,
                    updatedAt: result.user.updatedAt,
                },
                token,
                expiresIn: this.jwtExpiresIn,
            };
        }
        catch (error) {
            logger_1.logger.error('Error in register:', error);
            throw error;
        }
    }
    async login(email, password) {
        try {
            // Find user by email
            const user = await this.prisma.user.findUnique({
                where: { email },
                include: {
                    farm: true,
                },
            });
            if (!user) {
                throw (0, errorHandler_1.createError)('Invalid email or password', 401);
            }
            // Check if user is active
            if (user.status !== 'ACTIVE') {
                throw (0, errorHandler_1.createError)('Account is inactive', 401);
            }
            // Verify password
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw (0, errorHandler_1.createError)('Invalid email or password', 401);
            }
            // Generate JWT token
            const token = this.generateToken(user.id);
            logger_1.logger.info(`User logged in successfully: ${email}`);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                token,
                expiresIn: this.jwtExpiresIn,
            };
        }
        catch (error) {
            logger_1.logger.error('Error in login:', error);
            throw error;
        }
    }
    async getUserProfile(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    farm: true,
                },
            });
            if (!user) {
                throw (0, errorHandler_1.createError)('User not found', 404);
            }
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        }
        catch (error) {
            logger_1.logger.error('Error in getUserProfile:', error);
            throw error;
        }
    }
    async refreshToken(userId) {
        try {
            // Check if user exists and is active
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || user.status !== 'ACTIVE') {
                throw (0, errorHandler_1.createError)('User not found or inactive', 401);
            }
            // Generate new token
            const token = this.generateToken(userId);
            logger_1.logger.info(`Token refreshed for user: ${userId}`);
            return {
                token,
                expiresIn: this.jwtExpiresIn,
            };
        }
        catch (error) {
            logger_1.logger.error('Error in refreshToken:', error);
            throw error;
        }
    }
    async logout(userId) {
        try {
            // In a real application, you might want to:
            // 1. Add token to blacklist
            // 2. Log logout event
            // 3. Clear user sessions
            logger_1.logger.info(`User logged out: ${userId}`);
        }
        catch (error) {
            logger_1.logger.error('Error in logout:', error);
            throw error;
        }
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({
            userId,
            iat: Math.floor(Date.now() / 1000)
        }, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map