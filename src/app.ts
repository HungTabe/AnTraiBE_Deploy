import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupSwagger } from './middleware/swagger';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
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
app.use(cors({
	origin: process.env.NODE_ENV === 'production' 
		? ['https://antrai.com', 'https://www.antrai.com']
		: ['http://localhost:3000', 'http://localhost:3001'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.path} - ${req.ip}`);
	next();
});

// Setup Swagger documentation
setupSwagger(app);

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
import authRoutes from './routes/auth';
import poultryRoutes from './routes/poultry';
import penRoutes from './routes/pen';

app.use('/api/auth', authRoutes);
app.use('/api/poultry', poultryRoutes);
app.use('/api/pens', penRoutes);
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
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
	logger.info(`🚀 AnTrai API Server running on port ${PORT}`);
	logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
	logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;
