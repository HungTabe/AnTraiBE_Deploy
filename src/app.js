"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_1 = require("./middleware/swagger");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://antrai.com', 'https://www.antrai.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve static uploads
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Request logging middleware
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});
// Setup Swagger documentation
(0, swagger_1.setupSwagger)(app);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'AnTrai API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
    });
});
// API Routes
const auth_1 = __importDefault(require("./routes/auth"));
const poultry_1 = __importDefault(require("./routes/poultry"));
const pen_1 = __importDefault(require("./routes/pen"));
app.use('/api/auth', auth_1.default);
app.use('/api/poultry', poultry_1.default);
app.use('/api/pens', pen_1.default);
// app.use('/api/users', userRoutes);
// app.use('/api/farms', farmRoutes);
// app.use('/api/care', careRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/experts', expertRoutes);
// app.use('/api/weather', weatherRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/reports', reportRoutes);
// 404 handler - catch all unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.originalUrl} not found`,
            details: 'Please check the API documentation at /api-docs',
        },
        timestamp: new Date().toISOString(),
    });
});
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`🚀 AnTrai API Server running on port ${PORT}`);
    logger_1.logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger_1.logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});
exports.default = app;
//# sourceMappingURL=app.js.map