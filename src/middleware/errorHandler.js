"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.createError = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (error, req, res, next) => {
    let { statusCode = 500, message } = error;
    // Log error
    logger_1.logger.error(`Error ${statusCode}: ${message}`, {
        error: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    else if (error.name === 'MulterError') {
        statusCode = 400;
        message = 'File upload error';
    }
    // Don't leak error details in production
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Internal Server Error';
    }
    res.status(statusCode).json({
        success: false,
        error: {
            code: getErrorCode(statusCode),
            message,
            ...(process.env.NODE_ENV !== 'production' && {
                details: error.stack,
            }),
        },
        timestamp: new Date().toISOString(),
    });
};
exports.errorHandler = errorHandler;
const getErrorCode = (statusCode) => {
    const codes = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        422: 'VALIDATION_ERROR',
        429: 'TOO_MANY_REQUESTS',
        500: 'INTERNAL_SERVER_ERROR',
        502: 'BAD_GATEWAY',
        503: 'SERVICE_UNAVAILABLE',
    };
    return codes[statusCode] || 'UNKNOWN_ERROR';
};
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map