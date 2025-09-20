"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const logger_1 = require("../utils/logger");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * Register a new user
     */
    async register(req, res) {
        try {
            const userData = req.body;
            const result = await this.authService.register(userData);
            res.status(201).json({
                success: true,
                data: result,
                message: 'User registered successfully',
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error in register:', error);
            throw error;
        }
    }
    /**
     * Login user
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json({
                success: true,
                data: result,
                message: 'Login successful',
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error in login:', error);
            throw error;
        }
    }
    /**
     * Get current user profile
     */
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await this.authService.getUserProfile(userId);
            res.status(200).json({
                success: true,
                data: user,
                message: 'User profile retrieved successfully',
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error in getProfile:', error);
            throw error;
        }
    }
    /**
     * Refresh access token
     */
    async refreshToken(req, res) {
        try {
            const userId = req.user.id;
            const result = await this.authService.refreshToken(userId);
            res.status(200).json({
                success: true,
                data: result,
                message: 'Token refreshed successfully',
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error in refreshToken:', error);
            throw error;
        }
    }
    /**
     * Logout user
     */
    async logout(req, res) {
        try {
            const userId = req.user.id;
            await this.authService.logout(userId);
            res.status(200).json({
                success: true,
                message: 'Logout successful',
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error in logout:', error);
            throw error;
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map