import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Setup test database connection
  const prisma = new PrismaClient({
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
  const prisma = new PrismaClient({
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
export const testUserData = {
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

export const testLoginData = {
  email: 'test@example.com',
  password: 'Password123'
};
