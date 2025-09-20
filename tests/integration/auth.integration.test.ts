import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { testUserData, testLoginData } from '../setup';

describe('Auth API Integration Tests', () => {
  let prisma: PrismaClient;
  let authToken: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    
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
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUserData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user.email).toBe(testUserData.email);
      expect(registerResponse.body.data.token).toBeDefined();

      authToken = registerResponse.body.data.token;

      // Step 2: Verify user exists in database
      const user = await prisma.user.findUnique({
        where: { email: testUserData.email },
        include: { farm: true }
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe(testUserData.email);
      expect(user?.farm).toBeDefined();
      expect(user?.farm?.name).toBe(testUserData.farmName);
    });

    it('should reject duplicate email registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('already exists');
    });
  });

  describe('User Login Flow', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(testLoginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testLoginData.email);
      expect(response.body.data.token).toBeDefined();

      authToken = response.body.data.token;
    });

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testLoginData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testLoginData.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid email or password');
    });
  });

  describe('Protected Routes', () => {
    it('should access profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUserData.email);
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger UI', async () => {
      const response = await request(app)
        .get('/api-docs')
        .expect(200);

      expect(response.text).toContain('swagger');
    });

    it('should serve API health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.message).toContain('AnTrai API');
    });
  });
});
