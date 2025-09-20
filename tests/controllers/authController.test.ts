import request from 'supertest';
import express from 'express';
import { AuthController } from '../../src/controllers/authController';
import { AuthService } from '../../src/services/authService';
import { validateAuth, validate } from '../../src/middleware/validation';
import { asyncHandler } from '../../src/middleware/errorHandler';
import { authenticateToken } from '../../src/middleware/auth';
import { testUserData, testLoginData } from '../setup';

// Mock AuthService and Auth Middleware
jest.mock('../../src/services/authService');
jest.mock('../../src/middleware/auth');
jest.mock('../../src/middleware/validation');

describe('AuthController', () => {
  let app: express.Application;
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Create mock AuthService
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      getUserProfile: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
    } as any;

    // Mock authenticateToken middleware
    (authenticateToken as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
      req.user = { id: 1, email: 'test@example.com', role: 'FARMER' };
      next();
    });

    // Mock validation middleware
    (validate as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
      next();
    });

    authController = new AuthController(mockAuthService);

    // Setup routes
    app.post('/api/auth/register', validateAuth.register, validate, asyncHandler(authController.register.bind(authController)));
    app.post('/api/auth/login', validateAuth.login, validate, asyncHandler(authController.login.bind(authController)));
    app.get('/api/auth/profile', authenticateToken, asyncHandler(authController.getProfile.bind(authController)));
    app.post('/api/auth/refresh', authenticateToken, asyncHandler(authController.refreshToken.bind(authController)));
    app.post('/api/auth/logout', authenticateToken, asyncHandler(authController.logout.bind(authController)));
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockResult = {
        user: {
          id: 1,
          email: testUserData.email,
          firstName: testUserData.firstName,
          lastName: testUserData.lastName,
          phone: testUserData.phone,
          role: 'FARMER',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'mock-jwt-token',
        expiresIn: '7d',
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUserData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUserData.email);
      expect(response.body.data.token).toBe('mock-jwt-token');
      expect(mockAuthService.register).toHaveBeenCalledWith(testUserData);
    });

    it('should return 400 for invalid input data', async () => {
      // Mock validation to fail
      (validate as jest.Mock).mockImplementationOnce((req: any, res: any, next: any) => {
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

      const response = await request(app)
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
          email: testLoginData.email,
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

      const response = await request(app)
        .post('/api/auth/login')
        .send(testLoginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testLoginData.email);
      expect(response.body.data.token).toBe('mock-jwt-token');
      expect(mockAuthService.login).toHaveBeenCalledWith(testLoginData.email, testLoginData.password);
    });

    it('should return 400 for missing credentials', async () => {
      // Mock validation to fail
      (validate as jest.Mock).mockImplementationOnce((req: any, res: any, next: any) => {
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

      const response = await request(app)
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

      const response = await request(app)
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

      const response = await request(app)
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

      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
      expect(mockAuthService.logout).toHaveBeenCalledWith(1);
    });
  });
});
