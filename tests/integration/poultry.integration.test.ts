import request from 'supertest';
import app from '../../src/app';
import { PrismaClient, PoultryType, Gender } from '@prisma/client';
import { testUserData } from '../setup';
import path from 'path';

describe('Poultry API Integration Tests', () => {
	let prisma: PrismaClient;
	let authToken: string;
	let farmId: number;
	let penId: number;
	let poultryId: number;
	let photoId: number | undefined;

	beforeAll(async () => {
		prisma = new PrismaClient();
		await prisma.poultryPhoto.deleteMany();
		await prisma.poultry.deleteMany();
		await prisma.pen.deleteMany();
		await prisma.farm.deleteMany();
		await prisma.user.deleteMany();

		const registerResponse = await request(app)
			.post('/api/auth/register')
			.send(testUserData)
			.expect(201);

		authToken = registerResponse.body.data.token;
		const user = await prisma.user.findUnique({ where: { email: testUserData.email }, include: { farm: true } });
		farmId = user?.farm?.id as number;

		// Create a pen for classification
		const penRes = await request(app)
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
		const res = await request(app)
			.post('/api/poultry')
			.set('Authorization', `Bearer ${authToken}`)
			.send({
				name: 'Ga Mai 001',
				type: PoultryType.CHICKEN,
				gender: Gender.FEMALE,
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
		const res = await request(app)
			.get(`/api/poultry/${poultryId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(res.body.data.id).toBe(poultryId);
	});

	it('should list poultry with filters', async () => {
		const res = await request(app)
			.get('/api/poultry')
			.set('Authorization', `Bearer ${authToken}`)
			.query({ search: 'Ga', type: PoultryType.CHICKEN, penId })
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(Array.isArray(res.body.items)).toBe(true);
		expect(res.body.items.length).toBeGreaterThanOrEqual(1);
	});

	it('should update poultry', async () => {
		const res = await request(app)
			.put(`/api/poultry/${poultryId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.send({ weight: 2.8, notes: 'Updated weight' })
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(res.body.data.weight).toBe(2.8);
	});

	it('should add poultry photo via upload', async () => {
		const filePath = path.join(__dirname, '..', 'fixtures', 'sample.jpg');
		const res = await request(app)
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
		const res = await request(app)
			.delete(`/api/poultry/${poultryId}/photos/${photoId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(200);

		expect(res.body.success).toBe(true);
	});

	it('should delete poultry', async () => {
		const res = await request(app)
			.delete(`/api/poultry/${poultryId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(200);

		expect(res.body.success).toBe(true);
	});
});
