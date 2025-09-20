"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = require("../../src/services/authService");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const setup_1 = require("../setup");
// Mock Prisma Client
jest.mock('@prisma/client');
describe('AuthService', () => {
    let authService;
    let mockPrisma;
    beforeEach(() => {
        mockPrisma = {
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
            },
            farm: {
                create: jest.fn(),
            },
            $transaction: jest.fn(),
        };
        client_1.PrismaClient.mockImplementation(() => mockPrisma);
        authService = new authService_1.AuthService();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                id: 1,
                email: setup_1.testUserData.email,
                firstName: setup_1.testUserData.firstName,
                lastName: setup_1.testUserData.lastName,
                phone: setup_1.testUserData.phone,
                role: 'FARMER',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockFarm = {
                id: 1,
                name: setup_1.testUserData.farmName,
                address: setup_1.testUserData.farmAddress,
                city: setup_1.testUserData.farmCity,
                province: setup_1.testUserData.farmProvince,
                userId: 1,
            };
            // Mock transaction
            mockPrisma.$transaction.mockImplementation(async (callback) => {
                return callback({
                    user: {
                        create: jest.fn().mockResolvedValue(mockUser),
                    },
                    farm: {
                        create: jest.fn().mockResolvedValue(mockFarm),
                    },
                });
            });
            // Mock user not existing
            mockPrisma.user.findUnique.mockResolvedValue(null);
            const result = await authService.register(setup_1.testUserData);
            expect(result.user.email).toBe(setup_1.testUserData.email);
            expect(result.user.firstName).toBe(setup_1.testUserData.firstName);
            expect(result.token).toBeDefined();
            expect(result.expiresIn).toBe('7d');
        });
        it('should throw error if user already exists', async () => {
            const existingUser = {
                id: 1,
                email: setup_1.testUserData.email,
                firstName: 'Existing',
                lastName: 'User',
                phone: '+84123456789',
                role: 'FARMER',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrisma.user.findUnique.mockResolvedValue(existingUser);
            await expect(authService.register(setup_1.testUserData)).rejects.toThrow('User already exists');
        });
    });
    describe('login', () => {
        it('should login user with correct credentials', async () => {
            const hashedPassword = await bcryptjs_1.default.hash('Password123', 12);
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: hashedPassword,
                firstName: 'Test',
                lastName: 'User',
                phone: '+84123456789',
                role: 'FARMER',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                farm: {
                    id: 1,
                    name: 'Test Farm',
                    address: '123 Test Street',
                    city: 'Test City',
                    province: 'Test Province',
                },
            };
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            const result = await authService.login('test@example.com', 'Password123');
            expect(result.user.email).toBe('test@example.com');
            expect(result.token).toBeDefined();
            expect(result.expiresIn).toBe('7d');
        });
        it('should throw error for invalid email', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            await expect(authService.login('nonexistent@example.com', 'Password123'))
                .rejects.toThrow('Invalid email or password');
        });
        it('should throw error for invalid password', async () => {
            const hashedPassword = await bcryptjs_1.default.hash('CorrectPassword', 12);
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: hashedPassword,
                firstName: 'Test',
                lastName: 'User',
                phone: '+84123456789',
                role: 'FARMER',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                farm: null,
            };
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            await expect(authService.login('test@example.com', 'WrongPassword'))
                .rejects.toThrow('Invalid email or password');
        });
        it('should throw error for inactive user', async () => {
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: 'hashedpassword',
                firstName: 'Test',
                lastName: 'User',
                phone: '+84123456789',
                role: 'FARMER',
                status: 'INACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                farm: null,
            };
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            await expect(authService.login('test@example.com', 'Password123'))
                .rejects.toThrow('Account is inactive');
        });
    });
    describe('getUserProfile', () => {
        it('should return user profile successfully', async () => {
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                phone: '+84123456789',
                role: 'FARMER',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                farm: {
                    id: 1,
                    name: 'Test Farm',
                    address: '123 Test Street',
                    city: 'Test City',
                    province: 'Test Province',
                },
            };
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            const result = await authService.getUserProfile(1);
            expect(result.email).toBe('test@example.com');
            expect(result.firstName).toBe('Test');
            expect(result.lastName).toBe('User');
        });
        it('should throw error if user not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            await expect(authService.getUserProfile(999)).rejects.toThrow('User not found');
        });
    });
});
//# sourceMappingURL=authService.test.js.map