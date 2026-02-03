/**
 * Validation Schemas using native validation
 * Can be easily replaced with Zod/Joi if needed
 */

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (Indian format)
const phoneRegex = /^[6-9]\d{9}$/;

// Validation helper functions
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { valid: false, message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email format' };
    }
    return { valid: true };
};

export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return { valid: false, message: 'Phone number is required' };
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        return { valid: false, message: 'Invalid phone number format' };
    }
    return { valid: true };
};

export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { valid: false, message: 'Password is required' };
    }
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    return { valid: true };
};

export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true };
};

export const validateLength = (value, fieldName, min, max) => {
    if (!value || typeof value !== 'string') {
        return { valid: false, message: `${fieldName} is required` };
    }
    if (min && value.length < min) {
        return { valid: false, message: `${fieldName} must be at least ${min} characters` };
    }
    if (max && value.length > max) {
        return { valid: false, message: `${fieldName} must be at most ${max} characters` };
    }
    return { valid: true };
};

export const validateEnum = (value, fieldName, allowedValues) => {
    if (!allowedValues.includes(value)) {
        return { valid: false, message: `${fieldName} must be one of: ${allowedValues.join(', ')}` };
    }
    return { valid: true };
};

// Schema validators
export const schemas = {
    // Client registration schema
    clientRegistration: (data) => {
        const errors = [];
        
        const fullName = validateRequired(data.fullName, 'Full name');
        if (!fullName.valid) errors.push(fullName.message);
        
        const email = validateEmail(data.email);
        if (!email.valid) errors.push(email.message);
        
        const phone = validatePhone(data.phone);
        if (!phone.valid) errors.push(phone.message);
        
        const password = validatePassword(data.password);
        if (!password.valid) errors.push(password.message);
        
        return { valid: errors.length === 0, errors };
    },

    // Advocate registration schema
    advocateRegistration: (data) => {
        const errors = [];
        
        const fullName = validateRequired(data.fullName, 'Full name');
        if (!fullName.valid) errors.push(fullName.message);
        
        const email = validateEmail(data.email);
        if (!email.valid) errors.push(email.message);
        
        const phone = validatePhone(data.phone);
        if (!phone.valid) errors.push(phone.message);
        
        const password = validatePassword(data.password);
        if (!password.valid) errors.push(password.message);
        
        return { valid: errors.length === 0, errors };
    },

    // Login schema
    login: (data) => {
        const errors = [];
        
        const email = validateEmail(data.email);
        if (!email.valid) errors.push(email.message);
        
        const password = validateRequired(data.password, 'Password');
        if (!password.valid) errors.push(password.message);
        
        return { valid: errors.length === 0, errors };
    },

    // Incident report schema
    incidentReport: (data) => {
        const errors = [];
        
        const title = validateLength(data.title, 'Title', 5, 200);
        if (!title.valid) errors.push(title.message);
        
        const incidentDetails = validateLength(data.incidentDetails, 'Incident details', 20, 5000);
        if (!incidentDetails.valid) errors.push(incidentDetails.message);
        
        const location = validateRequired(data.location, 'Location');
        if (!location.valid) errors.push(location.message);
        
        const validTypes = ['corruption', 'police_misconduct', 'government_negligence', 'fraud', 'other'];
        const incidentType = validateEnum(data.incidentType, 'Incident type', validTypes);
        if (!incidentType.valid) errors.push(incidentType.message);
        
        if (data.urgency) {
            const validUrgency = ['low', 'medium', 'high', 'critical'];
            const urgency = validateEnum(data.urgency, 'Urgency', validUrgency);
            if (!urgency.valid) errors.push(urgency.message);
        }
        
        return { valid: errors.length === 0, errors };
    },

    // Chat creation schema
    createChat: (data) => {
        const errors = [];
        
        const title = validateLength(data.title, 'Title', 1, 100);
        if (!title.valid) errors.push(title.message);
        
        return { valid: errors.length === 0, errors };
    },

    // Message schema
    message: (data) => {
        const errors = [];
        
        const content = validateRequired(data.content, 'Message content');
        if (!content.valid) errors.push(content.message);
        
        const chat = validateRequired(data.chat, 'Chat ID');
        if (!chat.valid) errors.push(chat.message);
        
        return { valid: errors.length === 0, errors };
    },

    // Advocate onboarding schema
    advocateOnboarding: (data) => {
        const errors = [];
        
        const barCouncilNumber = validateRequired(data.barCouncilNumber, 'Bar Council Number');
        if (!barCouncilNumber.valid) errors.push(barCouncilNumber.message);
        
        const specialization = validateRequired(data.specialization, 'Specialization');
        if (!specialization.valid) errors.push(specialization.message);
        
        const yearsOfPractice = validateRequired(data.yearsOfPractice, 'Years of practice');
        if (!yearsOfPractice.valid) errors.push(yearsOfPractice.message);
        
        const location = validateRequired(data.location, 'Location');
        if (!location.valid) errors.push(location.message);
        
        return { valid: errors.length === 0, errors };
    },

    // Client onboarding schema
    clientOnboarding: (data) => {
        const errors = [];
        
        const state = validateRequired(data.state, 'State');
        if (!state.valid) errors.push(state.message);
        
        return { valid: errors.length === 0, errors };
    }
};

// Middleware factory for validation
export const validate = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return next();
        }
        
        const result = schema(req.body);
        if (!result.valid) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: result.errors
            });
        }
        
        next();
    };
};

export default { schemas, validate };
