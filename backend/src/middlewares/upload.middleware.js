import multer from 'multer';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/constants.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function - use plain Error to avoid Express 5 compatibility issues
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images, videos, and PDF files are allowed'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    }
});

// Middleware for handling multiple files (client and advocate)
export const uploadFiles = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'barCertificate', maxCount: 1 }
]);

// Middleware for handling single file
export const uploadSingle = upload.single('file');

/**
 * Promise-wrapped multer middleware for incident evidence files.
 * This prevents Express 5 + multer v2 compatibility issues where
 * multer errors bypass the controller and cause double-response crashes.
 */
export const uploadMultipleFiles = (req, res, next) => {
    const multerMiddleware = upload.array('evidenceFiles', 5);
    multerMiddleware(req, res, (err) => {
        if (err) {
            // Handle multer-specific errors gracefully
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Maximum size is 10MB per file.' });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ message: 'Too many files. Maximum 5 files allowed.' });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ message: 'Unexpected file field.' });
            }
            // File type error or other multer error
            return res.status(400).json({ message: err.message || 'File upload error.' });
        }
        next();
    });
};

export default upload;