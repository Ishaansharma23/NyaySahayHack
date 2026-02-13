import clientModel from "../models/Client.model.js";
import advocateModel from "../models/Advocate.model.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { USER_ROLES } from "../utils/constants.js";

/**
 * Protect Route Middleware
 * Verifies JWT token and attaches user to request
 */
export const protectRoute = asyncHandler(async (req, res, next) => {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers.authorization || '';
    const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
        throw ApiError.unauthorized("Please login to access this resource");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user = null;
        
        // Check user role and find in appropriate model
        if (decoded.role === USER_ROLES.CLIENT) {
            user = await clientModel.findById(decoded.userId).select("-password");
        } else if (decoded.role === USER_ROLES.ADVOCATE) {
            user = await advocateModel.findById(decoded.userId).select("-password");
        }

        if (!user) {
            throw ApiError.unauthorized("User not found");
        }

        // Attach user and role to request
        req.user = user;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        throw ApiError.unauthorized("Invalid or expired token");
    }
});

/**
 * Role-Based Access Control Middleware Factory
 * Restricts access to specific user roles
 * @param {...string} allowedRoles - Roles that can access the route
 */
export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.userRole) {
            throw ApiError.unauthorized("Please login first");
        }

        if (!allowedRoles.includes(req.userRole)) {
            throw ApiError.forbidden(
                `Access denied. This resource is only available for ${allowedRoles.join(' or ')}`
            );
        }

        next();
    };
};

/**
 * Client Only Middleware
 * Shorthand for restrictTo(USER_ROLES.CLIENT)
 */
export const clientOnly = restrictTo(USER_ROLES.CLIENT);

/**
 * Advocate Only Middleware
 * Shorthand for restrictTo(USER_ROLES.ADVOCATE)
 */
export const advocateOnly = restrictTo(USER_ROLES.ADVOCATE);

/**
 * Optional Auth Middleware
 * Attaches user to request if token exists, but doesn't require it
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers.authorization || '';
    const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user = null;
        
        if (decoded.role === USER_ROLES.CLIENT) {
            user = await clientModel.findById(decoded.userId).select("-password");
        } else if (decoded.role === USER_ROLES.ADVOCATE) {
            user = await advocateModel.findById(decoded.userId).select("-password");
        }

        if (user) {
            req.user = user;
            req.userRole = decoded.role;
        }
    } catch (err) {
        // Token invalid, continue without user
    }

    next();
});

/**
 * Verify Profile Complete Middleware
 * Ensures user has completed their profile/onboarding
 */
export const requireCompleteProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw ApiError.unauthorized("Please login first");
    }

    const isComplete = req.userRole === USER_ROLES.CLIENT
        ? Boolean(req.user.state && req.user.idProof)
        : Boolean(req.user.barCouncilNumber && req.user.specialization);

    if (!isComplete) {
        throw ApiError.forbidden("Please complete your profile first");
    }

    next();
});