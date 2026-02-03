import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Global Error Handler Middleware
 * Catches all errors and returns standardized error responses
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error(err.message, {
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || [];

    // Handle specific error types
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errors = Object.values(err.errors).map(e => e.message);
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400;
        message = 'File size too large';
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        statusCode = 400;
        message = 'Unexpected file field';
    }

    // Send error response
    const response = {
        success: false,
        message,
        ...(errors.length > 0 && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    res.status(statusCode).json(response);
};

/**
 * Not Found Handler
 * Handles 404 errors for undefined routes
 */
const notFoundHandler = (req, res, next) => {
    const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
    next(error);
};

export { errorHandler, notFoundHandler };
