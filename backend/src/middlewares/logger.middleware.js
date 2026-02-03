import logger from '../utils/logger.js';

/**
 * Request Logger Middleware
 * Logs incoming requests and response times
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Log incoming request
    logger.request(req);
    
    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(...args) {
        const responseTime = Date.now() - startTime;
        logger.response(req, res, responseTime);
        originalEnd.apply(res, args);
    };
    
    next();
};

export default requestLogger;
