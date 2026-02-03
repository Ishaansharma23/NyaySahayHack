/**
 * Simple Logger Utility
 * Provides structured logging with different log levels
 * Can be extended to use Winston or Pino in production
 */

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const currentLevel = process.env.LOG_LEVEL || 'debug';

const shouldLog = (level) => {
    return logLevels[level] <= logLevels[currentLevel];
};

const formatDate = () => {
    return new Date().toISOString();
};

const formatMessage = (level, message, meta = {}) => {
    const timestamp = formatDate();
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaStr}`;
};

const logger = {
    error: (message, meta = {}) => {
        if (shouldLog('error')) {
            console.error(`${colors.red}${formatMessage('error', message, meta)}${colors.reset}`);
        }
    },

    warn: (message, meta = {}) => {
        if (shouldLog('warn')) {
            console.warn(`${colors.yellow}${formatMessage('warn', message, meta)}${colors.reset}`);
        }
    },

    info: (message, meta = {}) => {
        if (shouldLog('info')) {
            console.info(`${colors.green}${formatMessage('info', message, meta)}${colors.reset}`);
        }
    },

    http: (message, meta = {}) => {
        if (shouldLog('http')) {
            console.log(`${colors.cyan}${formatMessage('http', message, meta)}${colors.reset}`);
        }
    },

    debug: (message, meta = {}) => {
        if (shouldLog('debug')) {
            console.log(`${colors.gray}${formatMessage('debug', message, meta)}${colors.reset}`);
        }
    },

    // Request logger for HTTP requests
    request: (req) => {
        const meta = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || req.connection?.remoteAddress,
            userAgent: req.get('user-agent')?.substring(0, 50)
        };
        logger.http(`${req.method} ${req.originalUrl}`, meta);
    },

    // Response logger
    response: (req, res, responseTime) => {
        const meta = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime: `${responseTime}ms`
        };
        const color = res.statusCode >= 400 ? 'warn' : 'http';
        logger[color](`${req.method} ${req.originalUrl} ${res.statusCode}`, meta);
    }
};

export default logger;
