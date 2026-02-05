/**
 * Application Constants
 * Centralized configuration values
 */

export const USER_ROLES = {
    CLIENT: 'client',
    ADVOCATE: 'advocate',
    ADMIN: 'admin'
};

export const INCIDENT_STATUS = {
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    FORWARDED: 'forwarded',
    RESOLVED: 'resolved'
};

export const INCIDENT_TYPES = {
    CORRUPTION: 'corruption',
    POLICE_MISCONDUCT: 'police_misconduct',
    GOVERNMENT_NEGLIGENCE: 'government_negligence',
    FRAUD: 'fraud',
    OTHER: 'other'
};

export const URGENCY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

export const CASE_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
};

export const CONNECTION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
};

export const MESSAGE_ROLES = {
    USER: 'user',
    MODEL: 'model',
    SYSTEM: 'system'
};

export const FILE_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
    DOCUMENT: 'document'
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf'
];

export const JWT_EXPIRY = '7d';

export const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // per window
    AUTH_MAX_REQUESTS: 100 // for auth endpoints
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

export default {
    USER_ROLES,
    INCIDENT_STATUS,
    INCIDENT_TYPES,
    URGENCY_LEVELS,
    CASE_STATUS,
    CONNECTION_STATUS,
    MESSAGE_ROLES,
    FILE_TYPES,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES,
    JWT_EXPIRY,
    RATE_LIMIT,
    PAGINATION
};
