"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const client_1 = require("@prisma/client");
const setup_1 = require("../setup");
describe('Pens API Integration Tests', () => {
    let prisma;
    let authToken;
    let farmId;
    let penId;
    beforeAll(async () => {
        prisma = new client_1.PrismaClient();
        await prisma.poultryPhoto.deleteMany();
        await prisma.poultry.deleteMany();
        await prisma.pen.deleteMany();
        await prisma.farm.deleteMany();
        await prisma.user.deleteMany();
        const registerResponse = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send(setup_1.testUserData)
            .expect(201);
        authToken = registerResponse.body.data.token;
        const user = await prisma.user.findUnique({ where: { email: setup_1.testUserData.email }, include: { farm: true } });
        farmId = user?.farm?.id;
    });
    afterAll(async () => {
        await prisma.poultryPhoto.deleteMany();
        await prisma.poultry.deleteMany();
        await prisma.pen.deleteMany();
        await prisma.farm.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });
    it('should create a pen', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/pens')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ farmId, name: 'Chuồng A', description: 'Chuồng chính', capacity: 100 })
            .expect(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Chuồng A');
        penId = res.body.data.id;
    });
    it('should list pens by farm', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/pens')
            .set('Authorization', `Bearer ${authToken}`)
            .query({ farmId })
            .expect(200);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBeGreaterThanOrEqual(1);
    });
    it('should get pen by id', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/pens/${penId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(penId);
    });
    it('should update pen', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/pens/${penId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Chuồng A1', capacity: 120 })
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Chuồng A1');
        expect(res.body.data.capacity).toBe(120);
    });
    it('should delete pen', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/pens/${penId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(res.body.success).toBe(true);
    });
});
//# sourceMappingURL=pen.integration.test.js.map