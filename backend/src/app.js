import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Route imports
import authClientRoutes from "./routes/authClient.route.js";
import authAdvocateRoutes from "./routes/authAdvocate.route.js";
import authRoutes from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";
import incidentRoutes from "./routes/incident.route.js";
import advocateClientRoutes from "./routes/advocateClient.route.js";
import streamChatRoutes from "./routes/Streamchat.route.js";
import caseRoutes from "./routes/case.route.js";
import paymentRoutes from "./routes/payment.route.js";

// Middleware imports
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import requestLogger from "./middlewares/logger.middleware.js";
import { rateLimiter, authRateLimiter } from "./middlewares/rateLimit.middleware.js";
import logger from "./utils/logger.js";

const app = express();

// Global Middlewares


// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const envOrigins = [
            process.env.FRONTEND_URL,
            ...(process.env.FRONTEND_URLS || '').split(',')
        ]
            .map((value) => value?.trim())
            .filter(Boolean);

        const allowedOrigins = new Set([
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'https://nyay-sahay-hack.vercel.app',
            ...envOrigins
        ]);

        if (allowedOrigins.has(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Request logging
app.use(requestLogger);

// Rate limiting (global)
app.use(rateLimiter);

// Health Check

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NyaySahay API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});


// API Routes

// Authentication routes (with stricter rate limiting)
app.use('/api/auth', authRateLimiter, authClientRoutes);
app.use('/api/auth', authRateLimiter, authAdvocateRoutes);
app.use('/api/auth', authRoutes);

// Feature routes
app.use('/api/chat', chatRouter);
app.use('/api/incidents', incidentRoutes);
app.use('/api/connections', advocateClientRoutes);
app.use('/api/stream', streamChatRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handling


// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Log successful app initialization
logger.info('Express app initialized successfully');

export default app;