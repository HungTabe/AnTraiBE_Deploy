"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const client_1 = require("@prisma/client");
const setup_1 = require("../setup");
const path_1 = __importDefault(require("path"));
describe('Poultry API Integration Tests', () => {
    let prisma;
    let authToken;
    let farmId;
    let penId;
    let poultryId;
    let photoId;
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
        // Create a pen for classification
        const penRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/pens')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ farmId, name: 'Chuồng Test', capacity: 50 })
            .expect(201);
        penId = penRes.body.data.id;
    });
    afterAll(async () => {
        await prisma.poultryPhoto.deleteMany();
        await prisma.poultry.deleteMany();
        await prisma.pen.deleteMany();
        await prisma.farm.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });
    it('should create poultry', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/poultry')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            name: 'Ga Mai 001',
            type: client_1.PoultryType.CHICKEN,
            gender: client_1.Gender.FEMALE,
            age: 20,
            weight: 2.5,
            penId,
            notes: 'Test create',
        })
            .expect(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Ga Mai 001');
        poultryId = res.body.data.id;
    });
    it('should get poultry by id', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/poultry/${poultryId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(poultryId);
    });
    it('should list poultry with filters', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/poultry')
            .set('Authorization', `Bearer ${authToken}`)
            .query({ search: 'Ga', type: client_1.PoultryType.CHICKEN, penId })
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBeGreaterThanOrEqual(1);
    });
    it('should update poultry', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/poultry/${poultryId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ weight: 2.8, notes: 'Updated weight' })
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.weight).toBe(2.8);
    });
    it('should add poultry photo via upload', async () => {
        const filePath = path_1.default.join(__dirname, '..', 'fixtures', 'sample.jpg');
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/poultry/${poultryId}/photos`)
            .set('Authorization', `Bearer ${authToken}`)
            .attach('image', filePath)
            .field('caption', 'Ảnh thử nghiệm')
            .field('isMain', 'true')
            .expect(201);
        expect(res.body.success).toBe(true);
        photoId = res.body.data.id;
        expect(photoId).toBeDefined();
    });
    it('should delete poultry photo', async () => {
        if (!photoId) {
            throw new Error('photoId not defined from previous step');
        }
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/poultry/${poultryId}/photos/${photoId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(res.body.success).toBe(true);
    });
    it('should delete poultry', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/poultry/${poultryId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(res.body.success).toBe(true);
    });
});
//# sourceMappingURL=poultry.integration.test.js.map