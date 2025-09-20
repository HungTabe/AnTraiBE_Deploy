"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testLoginData = exports.testUserData = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
// Global test setup
beforeAll(async () => {
    // Setup test database connection
    const prisma = new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/antrai_test'
            }
        }
    });
    // Clean database before tests
    await prisma.user.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.$disconnect();
});
afterAll(async () => {
    // Cleanup after all tests
    const prisma = new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/antrai_test'
            }
        }
    });
    await prisma.user.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.$disconnect();
});
// Test data helpers
exports.testUserData = {
    email: 'test@example.com',
    password: 'Password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+84123456789',
    farmName: 'Test Farm',
    farmAddress: '123 Test Street, Test Ward',
    farmCity: 'Test City',
    farmProvince: 'Test Province'
};
exports.testLoginData = {
    email: 'test@example.com',
    password: 'Password123'
};
//# sourceMappingURL=setup.js.map