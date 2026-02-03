import { RATE_LIMIT } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';

/**
 * Simple In-Memory Rate Limiter
 * For production, use Redis-based rate limiting
 */

const requestCounts = new Map();

// Clean up old entries every minute
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requestCounts.entries()) {
        if (now - value.startTime > RATE_LIMIT.WINDOW_MS) {
            requestCounts.delete(key);
        }
    }
}, 60000);

/**
 * Rate Limiter Factory
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
const createRateLimiter = (maxRequests = RATE_LIMIT.MAX_REQUESTS, windowMs = RATE_LIMIT.WINDOW_MS) => {
    return (req, res, next) => {
        if (req.method === 'GET' && req.path === '/profile-status') {
            return next();
        }
        const key = `${req.ip}-${req.path}`;
        const now = Date.now();
        
        let requestData = requestCounts.get(key);
        
        if (!requestData || (now - requestData.startTime) > windowMs) {
            requestData = { count: 1, startTime: now };
            requestCounts.set(key, requestData);
        } else {
            requestData.count++;
        }
        
        // Set rate limit headers
        res.set({
            'X-RateLimit-Limit': maxRequests,
            'X-RateLimit-Remaining': Math.max(0, maxRequests - requestData.count),
            'X-RateLimit-Reset': new Date(requestData.startTime + windowMs).toISOString()
        });
        
        if (requestData.count > maxRequests) {
            return next(ApiError.tooManyRequests('Too many requests, please try again later'));
        }
        
        next();
    };
};

// Default rate limiter
const rateLimiter = createRateLimiter();

// Strict rate limiter for auth endpoints
const authRateLimiter = createRateLimiter(RATE_LIMIT.AUTH_MAX_REQUESTS, RATE_LIMIT.WINDOW_MS);

export { rateLimiter, authRateLimiter, createRateLimiter };
