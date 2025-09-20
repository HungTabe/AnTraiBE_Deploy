import swaggerUi from 'swagger-ui-express';
import specs from '../config/swagger';

/**
 * Setup Swagger UI middleware
 * @param app Express application instance
 */
export const setupSwagger = (app: any): void => {
  // Swagger UI options
  const swaggerUiOptions = {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .scheme-container { background: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0 }
    `,
    customSiteTitle: 'AnTrai API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      defaultModelRendering: 'example',
      displayOperationId: false,
      tryItOutEnabled: true,
      requestInterceptor: (req: any) => {
        // Add timestamp to requests
        req.headers['X-Request-Time'] = new Date().toISOString();
        return req;
      },
      responseInterceptor: (res: any) => {
        // Log response for debugging
        console.log(`API Response: ${res.status} - ${res.url}`);
        return res;
      },
    },
  };

  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

  // Serve raw JSON at /api-docs.json
  app.get('/api-docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  // Health check endpoint for documentation
  app.get('/docs/health', (req: any, res: any) => {
    res.json({
      status: 'healthy',
      message: 'API Documentation is running',
      timestamp: new Date().toISOString(),
      version: (specs as any).info.version,
    });
  });

  console.log('📚 Swagger documentation available at:');
  console.log(`   📖 UI: http://localhost:${process.env.PORT || 3000}/api-docs`);
  console.log(`   📄 JSON: http://localhost:${process.env.PORT || 3000}/api-docs.json`);
  console.log(`   ❤️  Health: http://localhost:${process.env.PORT || 3000}/docs/health`);
};
