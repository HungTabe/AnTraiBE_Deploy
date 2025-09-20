"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const client_1 = require("@prisma/client");
const setup_1 = require("../setup");
describe('Auth API Integration Tests', () => {
    let prisma;
    let authToken;
    beforeAll(async () => {
        prisma = new client_1.PrismaClient();
        // Clean database
        await prisma.user.deleteMany();
        await prisma.farm.deleteMany();
    });
    afterAll(async () => {
        // Cleanup
        await prisma.user.deleteMany();
        await prisma.farm.deleteMany();
        await prisma.$disconnect();
    });
    describe('User Registration Flow', () => {
        it('should complete full registration process', async () => {
            // Step 1: Register user
            const registerResponse = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send(setup_1.testUserData)
                .expect(201);
            expect(registerResponse.body.success).toBe(true);
            expect(registerResponse.body.data.user.email).toBe(setup_1.testUserData.email);
            expect(registerResponse.body.data.token).toBeDefined();
            authToken = registerResponse.body.data.token;
            // Step 2: Verify user exists in database
            const user = await prisma.user.findUnique({
                where: { email: setup_1.testUserData.email },
                include: { farm: true }
            });
            expect(user).toBeDefined();
            expect(user?.email).toBe(setup_1.testUserData.email);
            expect(user?.farm).toBeDefined();
            expect(user?.farm?.name).toBe(setup_1.testUserData.farmName);
        });
        it('should reject duplicate email registration', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send(setup_1.testUserData)
                .expect(409);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('already exists');
        });
    });
    describe('User Login Flow', () => {
        it('should login with correct credentials', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send(setup_1.testLoginData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(setup_1.testLoginData.email);
            expect(response.body.data.token).toBeDefined();
            authToken = response.body.data.token;
        });
        it('should reject login with incorrect password', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: setup_1.testLoginData.email,
                password: 'wrongpassword'
            })
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('Invalid email or password');
        });
        it('should reject login with non-existent email', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: setup_1.testLoginData.password
            })
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('Invalid email or password');
        });
    });
    describe('Protected Routes', () => {
        it('should access profile with valid token', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(setup_1.testUserData.email);
        });
        it('should refresh token successfully', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/refresh')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
        });
        it('should logout successfully', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
        });
    });
    describe('API Documentation', () => {
        it('should serve Swagger UI', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api-docs')
                .expect(200);
            expect(response.text).toContain('swagger');
        });
        it('should serve API health check', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/health')
                .expect(200);
            expect(response.body.status).toBe('healthy');
            expect(response.body.message).toContain('AnTrai API');
        });
    });
});
//# sourceMappingURL=auth.integration.test.js.map