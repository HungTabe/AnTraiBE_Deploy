import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AnTrai API',
      version: '1.0.0',
      description: 'Smart Poultry Management System API Documentation',
      contact: {
        name: 'AnTrai Development Team',
        email: 'support@antrai.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.antrai.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key for external services',
        },
      },
      schemas: {
        // Common Response Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
          required: ['success', 'data', 'message'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Validation failed',
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'name',
                      },
                      message: {
                        type: 'string',
                        example: 'Name is required',
                      },
                    },
                  },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
          required: ['success', 'error'],
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      example: 10,
                    },
                    total: {
                      type: 'integer',
                      example: 100,
                    },
                    pages: {
                      type: 'integer',
                      example: 10,
                    },
                  },
                },
              },
            },
            message: {
              type: 'string',
              example: 'Data retrieved successfully',
            },
          },
        },
        // User Schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'farmer@example.com',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            phone: {
              type: 'string',
              example: '+84123456789',
            },
            role: {
              type: 'string',
              enum: ['FARMER', 'EXPERT', 'ADMIN'],
              example: 'FARMER',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
              example: 'ACTIVE',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Poultry Schemas
        Poultry: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Gà mái đẻ #001',
            },
            tagNumber: {
              type: 'string',
              example: 'CH001',
            },
            type: {
              type: 'string',
              enum: ['CHICKEN', 'DUCK', 'GOOSE', 'TURKEY', 'QUAIL', 'OTHER'],
              example: 'CHICKEN',
            },
            gender: {
              type: 'string',
              enum: ['MALE', 'FEMALE', 'UNKNOWN'],
              example: 'FEMALE',
            },
            age: {
              type: 'integer',
              description: 'Age in weeks',
              example: 20,
            },
            weight: {
              type: 'number',
              example: 2.5,
            },
            healthStatus: {
              type: 'string',
              enum: ['HEALTHY', 'SICK', 'RECOVERING', 'QUARANTINE', 'DECEASED'],
              example: 'HEALTHY',
            },
            image: {
              type: 'string',
              example: 'https://example.com/poultry-image.jpg',
            },
            notes: {
              type: 'string',
              example: 'Gà mái đẻ tốt, sản xuất trứng đều đặn',
            },
            penId: {
              type: 'integer',
              example: 1,
            },
            breedId: {
              type: 'integer',
              example: 1,
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '2023-01-01',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Farm Schema
        Farm: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Trang trại AnTrai',
            },
            address: {
              type: 'string',
              example: '123 Đường ABC, Phường XYZ',
            },
            city: {
              type: 'string',
              example: 'Hà Nội',
            },
            province: {
              type: 'string',
              example: 'Hà Nội',
            },
            postalCode: {
              type: 'string',
              example: '100000',
            },
            latitude: {
              type: 'number',
              example: 21.0285,
            },
            longitude: {
              type: 'number',
              example: 105.8542,
            },
            description: {
              type: 'string',
              example: 'Trang trại chăn nuôi gia cầm quy mô vừa',
            },
            image: {
              type: 'string',
              example: 'https://example.com/farm-image.jpg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Care Record Schema
        CareRecord: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            type: {
              type: 'string',
              enum: ['FEEDING', 'MEDICATION', 'VACCINATION', 'HEALTH_CHECK', 'CLEANING', 'TEMPERATURE_CHECK', 'OTHER'],
              example: 'FEEDING',
            },
            description: {
              type: 'string',
              example: 'Cho ăn thức ăn hỗn hợp',
            },
            notes: {
              type: 'string',
              example: 'Gà ăn tốt, không có dấu hiệu bất thường',
            },
            cost: {
              type: 'number',
              example: 15000,
            },
            image: {
              type: 'string',
              example: 'https://example.com/care-image.jpg',
            },
            poultryId: {
              type: 'integer',
              example: 1,
            },
            userId: {
              type: 'integer',
              example: 1,
            },
            careDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T08:00:00.000Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Authentication Schemas
        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'farmer@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
          required: ['email', 'password'],
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'farmer@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            phone: {
              type: 'string',
              example: '+84123456789',
            },
            farmName: {
              type: 'string',
              example: 'Trang trại AnTrai',
            },
            farmAddress: {
              type: 'string',
              example: '123 Đường ABC, Phường XYZ',
            },
            farmCity: {
              type: 'string',
              example: 'Hà Nội',
            },
            farmProvince: {
              type: 'string',
              example: 'Hà Nội',
            },
          },
          required: ['email', 'password', 'firstName', 'lastName', 'farmName', 'farmAddress', 'farmCity', 'farmProvince'],
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                expiresIn: {
                  type: 'string',
                  example: '7d',
                },
              },
            },
            message: {
              type: 'string',
              example: 'Authentication successful',
            },
          },
        },
      },
      parameters: {
        // Common Parameters
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },
        IdParam: {
          name: 'id',
          in: 'path',
          description: 'Resource ID',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Farms',
        description: 'Farm management operations',
      },
      {
        name: 'Poultry',
        description: 'Poultry management operations',
      },
      {
        name: 'Pens',
        description: 'Pen/Coop management operations',
      },
      {
        name: 'Care',
        description: 'Care records and health tracking',
      },
      {
        name: 'Vaccinations',
        description: 'Vaccination scheduling and tracking',
      },
      {
        name: 'AI Chat',
        description: 'AI assistant and chat functionality',
      },
      {
        name: 'Experts',
        description: 'Expert consultation system',
      },
      {
        name: 'Weather',
        description: 'Weather data and alerts',
      },
      {
        name: 'Notifications',
        description: 'System notifications',
      },
      {
        name: 'Reports',
        description: 'Reports and analytics',
      },
    ],
  },
  apis: [
    './src/routes/*.ts', // Path to the API files
    './src/controllers/*.ts', // Path to controller files
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
