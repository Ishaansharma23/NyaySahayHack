import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/constants.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
        return;
    }
    cb(ApiError.badRequest('Only images, videos, and PDF files are allowed'), false);
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

// Middleware for handling multiple files (for incident reports)
export const uploadMultipleFiles = upload.array('evidenceFiles', 5); // Max 5 files

export default upload;