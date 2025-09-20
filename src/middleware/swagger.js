"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("../config/swagger"));
/**
 * Setup Swagger UI middleware
 * @param app Express application instance
 */
const setupSwagger = (app) => {
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
            requestInterceptor: (req) => {
                // Add timestamp to requests
                req.headers['X-Request-Time'] = new Date().toISOString();
                return req;
            },
            responseInterceptor: (res) => {
                // Log response for debugging
                console.log(`API Response: ${res.status} - ${res.url}`);
                return res;
            },
        },
    };
    // Serve Swagger UI at /api-docs
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, swaggerUiOptions));
    // Serve raw JSON at /api-docs.json
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swagger_1.default);
    });
    // Health check endpoint for documentation
    app.get('/docs/health', (req, res) => {
        res.json({
            status: 'healthy',
            message: 'API Documentation is running',
            timestamp: new Date().toISOString(),
            version: swagger_1.default.info.version,
        });
    });
    console.log('📚 Swagger documentation available at:');
    console.log(`   📖 UI: http://localhost:${process.env.PORT || 3000}/api-docs`);
    console.log(`   📄 JSON: http://localhost:${process.env.PORT || 3000}/api-docs.json`);
    console.log(`   ❤️  Health: http://localhost:${process.env.PORT || 3000}/docs/health`);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map