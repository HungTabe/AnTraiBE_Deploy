import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { testUserData } from '../setup';

describe('Pens API Integration Tests', () => {
	let prisma: PrismaClient;
	let authToken: string;
	let farmId: number;
	let penId: number;

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
		const res = await request(app)
			.post('/api/pens')
			.set('Authorization', `Bearer ${authToken}`)
			.send({ farmId, name: 'Chuồng A', description: 'Chuồng chính', capacity: 100 })
			.expect(201);

		expect(res.body.success).toBe(true);
		expect(res.body.data.name).toBe('Chuồng A');
		penId = res.body.data.id;
	});

	it('should list pens by farm', async () => {
		const res = await request(app)
			.get('/api/pens')
			.set('Authorization', `Bearer ${authToken}`)
			.query({ farmId })
			.expect(200);

		expect(Array.isArray(res.body.items)).toBe(true);
		expect(res.body.items.length).toBeGreaterThanOrEqual(1);
	});

	it('should get pen by id', async () => {
		const res = await request(app)
			.get(`/api/pens/${penId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(res.body.data.id).toBe(penId);
	});

	it('should update pen', async () => {
		const res = await request(app)
			.put(`/api/pens/${penId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.send({ name: 'Chuồng A1', capacity: 120 })
			.expect(200);

		expect(res.body.success).toBe(true);
		expect(res.body.data.name).toBe('Chuồng A1');
		expect(res.body.data.capacity).toBe(120);
	});

	it('should delete pen', async () => {
		const res = await request(app)
			.delete(`/api/pens/${penId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(200);

		expect(res.body.success).toBe(true);
	});
});
