"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const authController_1 = require("../../src/controllers/authController");
const validation_1 = require("../../src/middleware/validation");
const errorHandler_1 = require("../../src/middleware/errorHandler");
const auth_1 = require("../../src/middleware/auth");
const setup_1 = require("../setup");
// Mock AuthService and Auth Middleware
jest.mock('../../src/services/authService');
jest.mock('../../src/middleware/auth');
jest.mock('../../src/middleware/validation');
describe('AuthController', () => {
    let app;
    let authController;
    let mockAuthService;
    beforeEach(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        // Create mock AuthService
        mockAuthService = {
            register: jest.fn(),
            login: jest.fn(),
            getUserProfile: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
        };
        // Mock authenticateToken middleware
        auth_1.authenticateToken.mockImplementation((req, res, next) => {
            req.user = { id: 1, email: 'test@example.com', role: 'FARMER' };
            next();
        });
        // Mock validation middleware
        validation_1.validate.mockImplementation((req, res, next) => {
            next();
        });
        authController = new authController_1.AuthController(mockAuthService);
        // Setup routes
        app.post('/api/auth/register', validation_1.validateAuth.register, validation_1.validate, (0, errorHandler_1.asyncHandler)(authController.register.bind(authController)));
        app.post('/api/auth/login', validation_1.validateAuth.login, validation_1.validate, (0, errorHandler_1.asyncHandler)(authController.login.bind(authController)));
        app.get('/api/auth/profile', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(authController.getProfile.bind(authController)));
        app.post('/api/auth/refresh', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(authController.refreshToken.bind(authController)));
        app.post('/api/auth/logout', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(authController.logout.bind(authController)));
    });
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const mockResult = {
                user: {
                    id: 1,
                    email: setup_1.testUserData.email,
                    firstName: setup_1.testUserData.firstName,
                    lastName: setup_1.testUserData.lastName,
                    phone: setup_1.testUserData.phone,
                    role: 'FARMER',
                    status: 'ACTIVE',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                token: 'mock-jwt-token',
                expiresIn: '7d',
            };
            mockAuthService.register.mockResolvedValue(mockResult);
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(setup_1.testUserData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(setup_1.testUserData.email);
            expect(response.body.data.token).toBe('mock-jwt-token');
            expect(mockAuthService.register).toHaveBeenCalledWith(setup_1.testUserData);
        });
        it('should return 400 for invalid input data', async () => {
            // Mock validation to fail
            validation_1.validate.mockImplementationOnce((req, res, next) => {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: [
                            { field: 'email', message: 'Please provide a valid email' },
                            { field: 'password', message: 'Password must be at least 6 characters long' }
                        ]
                    },
                    timestamp: new Date().toISOString()
                });
            });
            const invalidData = {
                email: 'invalid-email',
                password: '123', // Too short
                firstName: '', // Empty
                lastName: '',
                farmName: '',
                farmAddress: '',
                farmCity: '',
                farmProvince: '',
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send(invalidData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('VALIDATION_ERROR');
            expect(mockAuthService.register).not.toHaveBeenCalled();
        });
    });
    describe('POST /api/auth/login', () => {
        it('should login user successfully', async () => {
            const mockResult = {
                user: {
                    id: 1,
                    email: setup_1.testLoginData.email,
                    firstName: 'Test',
                    lastName: 'User',
                    phone: '+84123456789',
                    role: 'FARMER',
                    status: 'ACTIVE',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                token: 'mock-jwt-token',
                expiresIn: '7d',
            };
            mockAuthService.login.mockResolvedValue(mockResult);
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send(setup_1.testLoginData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(setup_1.testLoginData.email);
            expect(response.body.data.token).toBe('mock-jwt-token');
            expect(mockAuthService.login).toHaveBeenCalledWith(setup_1.testLoginData.email, setup_1.testLoginData.password);
        });
        it('should return 400 for missing credentials', async () => {
            // Mock validation to fail
            validation_1.validate.mockImplementationOnce((req, res, next) => {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: [
                            { field: 'email', message: 'Please provide a valid email' },
                            { field: 'password', message: 'Password is required' }
                        ]
                    },
                    timestamp: new Date().toISOString()
                });
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({})
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('VALIDATION_ERROR');
            expect(mockAuthService.login).not.toHaveBeenCalled();
        });
    });
    describe('GET /api/auth/profile', () => {
        it('should return user profile successfully', async () => {
            const mockProfile = {
                id: 1,
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                phone: '+84123456789',
                role: 'FARMER',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockAuthService.getUserProfile.mockResolvedValue(mockProfile);
            const response = await (0, supertest_1.default)(app)
                .get('/api/auth/profile')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe('test@example.com');
            expect(mockAuthService.getUserProfile).toHaveBeenCalledWith(1);
        });
    });
    describe('POST /api/auth/refresh', () => {
        it('should refresh token successfully', async () => {
            const mockResult = {
                token: 'new-jwt-token',
                expiresIn: '7d',
            };
            mockAuthService.refreshToken.mockResolvedValue(mockResult);
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/refresh')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBe('new-jwt-token');
            expect(mockAuthService.refreshToken).toHaveBeenCalledWith(1);
        });
    });
    describe('POST /api/auth/logout', () => {
        it('should logout user successfully', async () => {
            mockAuthService.logout.mockResolvedValue();
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/logout')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Logout successful');
            expect(mockAuthService.logout).toHaveBeenCalledWith(1);
        });
    });
});
//# sourceMappingURL=authController.test.js.map