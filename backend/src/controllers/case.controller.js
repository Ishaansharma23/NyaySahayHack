import CaseModel from "../models/Case.model.js";
import { analyzeIncident } from "../service/ai.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { CASE_STATUS, USER_ROLES } from "../utils/constants.js";

/**
 * Create a new case
 * @route POST /api/cases
 * @access Client only
 */
export const createCase = asyncHandler(async (req, res) => {
    const { title, description, caseType, urgency, relatedIncident } = req.body;
    const user = req.user;

    if (user.role !== USER_ROLES.CLIENT) {
        throw ApiError.forbidden("Only clients can create cases");
    }

    // Create case
    const caseData = {
        title,
        description,
        caseType,
        urgency: urgency || 'medium',
        client: user._id,
        relatedIncident,
        updates: [{
            message: 'Case created successfully',
            status: CASE_STATUS.PENDING,
            updatedBy: user._id,
            updaterType: 'client'
        }]
    };

    const newCase = await CaseModel.create(caseData);

    // Optionally analyze case with AI
    try {
        const analysis = await analyzeIncident(description);
        if (analysis) {
            newCase.aiAnalysis = {
                ...analysis,
                analyzedAt: new Date()
            };
            await newCase.save();
        }
    } catch (error) {
        console.error("AI analysis failed:", error);
        // Continue without AI analysis
    }

    return new ApiResponse(201, {
        case: {
            _id: newCase._id,
            caseNumber: newCase.caseNumber,
            title: newCase.title,
            status: newCase.status,
            caseType: newCase.caseType,
            urgency: newCase.urgency,
            createdAt: newCase.createdAt
        }
    }, "Case created successfully").send(res);
});

/**
 * Get all cases for current user
 * @route GET /api/cases
 * @access Protected
 */
export const getCases = asyncHandler(async (req, res) => {
    const user = req.user;
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    
    if (user.role === USER_ROLES.CLIENT) {
        query.client = user._id;
    } else if (user.role === USER_ROLES.ADVOCATE) {
        query.advocate = user._id;
    }

    if (status) {
        query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [cases, total] = await Promise.all([
        CaseModel.find(query)
            .populate('client', 'fullName email profilePicture')
            .populate('advocate', 'fullName email profilePicture specialization')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        CaseModel.countDocuments(query)
    ]);

    return ApiResponse.success({
        cases,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    }, "Cases retrieved successfully").send(res);
});

/**
 * Get single case by ID
 * @route GET /api/cases/:id
 * @access Protected
 */
export const getCaseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    const caseData = await CaseModel.findById(id)
        .populate('client', 'fullName email phone profilePicture address state')
        .populate('advocate', 'fullName email phone profilePicture specialization yearsOfPractice location')
        .populate('relatedIncident');

    if (!caseData) {
        throw ApiError.notFound("Case not found");
    }

    // Check access permission
    const isClient = user.role === USER_ROLES.CLIENT && caseData.client._id.toString() === user._id.toString();
    const isAdvocate = user.role === USER_ROLES.ADVOCATE && caseData.advocate?._id?.toString() === user._id.toString();

    if (!isClient && !isAdvocate) {
        throw ApiError.forbidden("You don't have access to this case");
    }

    return ApiResponse.success({ case: caseData }, "Case retrieved successfully").send(res);
});

/**
 * Update case status
 * @route PATCH /api/cases/:id/status
 * @access Advocate only
 */
export const updateCaseStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, message } = req.body;
    const user = req.user;

    const caseData = await CaseModel.findById(id);

    if (!caseData) {
        throw ApiError.notFound("Case not found");
    }

    // Verify advocate access
    if (user.role !== USER_ROLES.ADVOCATE || caseData.advocate?.toString() !== user._id.toString()) {
        throw ApiError.forbidden("Only the assigned advocate can update case status");
    }

    // Validate status transition
    const validStatuses = Object.values(CASE_STATUS);
    if (!validStatuses.includes(status)) {
        throw ApiError.badRequest(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    await caseData.addUpdate(
        message || `Status updated to ${status}`,
        user._id,
        'Advocate',
        status
    );

    return ApiResponse.success({
        case: {
            _id: caseData._id,
            caseNumber: caseData.caseNumber,
            status: caseData.status,
            updatedAt: caseData.updatedAt
        }
    }, "Case status updated successfully").send(res);
});

/**
 * Accept case (Advocate)
 * @route POST /api/cases/:id/accept
 * @access Advocate only
 */
export const acceptCase = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { estimatedFee } = req.body;
    const user = req.user;

    if (user.role !== USER_ROLES.ADVOCATE) {
        throw ApiError.forbidden("Only advocates can accept cases");
    }

    const caseData = await CaseModel.findById(id);

    if (!caseData) {
        throw ApiError.notFound("Case not found");
    }

    if (caseData.advocate) {
        throw ApiError.conflict("This case already has an assigned advocate");
    }

    if (caseData.status !== CASE_STATUS.PENDING) {
        throw ApiError.badRequest("Only pending cases can be accepted");
    }

    caseData.advocate = user._id;
    caseData.status = CASE_STATUS.ACCEPTED;
    caseData.acceptedAt = new Date();
    
    if (estimatedFee) {
        caseData.billing = {
            estimatedFee,
            paymentStatus: 'pending'
        };
    }

    caseData.updates.push({
        message: `Case accepted by ${user.fullName}`,
        status: CASE_STATUS.ACCEPTED,
        updatedBy: user._id,
        updaterType: 'Advocate'
    });

    await caseData.save();

    return ApiResponse.success({
        case: {
            _id: caseData._id,
            caseNumber: caseData.caseNumber,
            status: caseData.status,
            advocate: user._id
        }
    }, "Case accepted successfully").send(res);
});

/**
 * Reject case (Advocate)
 * @route POST /api/cases/:id/reject
 * @access Advocate only
 */
export const rejectCase = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;

    if (user.role !== USER_ROLES.ADVOCATE) {
        throw ApiError.forbidden("Only advocates can reject cases");
    }

    const caseData = await CaseModel.findById(id);

    if (!caseData) {
        throw ApiError.notFound("Case not found");
    }

    if (caseData.status !== CASE_STATUS.PENDING) {
        throw ApiError.badRequest("Only pending cases can be rejected");
    }

    caseData.status = CASE_STATUS.REJECTED;
    caseData.updates.push({
        message: reason || 'Case rejected by advocate',
        status: CASE_STATUS.REJECTED,
        updatedBy: user._id,
        updaterType: 'Advocate'
    });

    await caseData.save();

    return ApiResponse.success({
        case: {
            _id: caseData._id,
            caseNumber: caseData.caseNumber,
            status: caseData.status
        }
    }, "Case rejected").send(res);
});

/**
 * Add document to case
 * @route POST /api/cases/:id/documents
 * @access Protected
 */
export const addDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { url, type, filename, description } = req.body;
    const user = req.user;

    const caseData = await CaseModel.findById(id);

    if (!caseData) {
        throw ApiError.notFound("Case not found");
    }

    // Verify access
    const isClient = user.role === USER_ROLES.CLIENT && caseData.client.toString() === user._id.toString();
    const isAdvocate = user.role === USER_ROLES.ADVOCATE && caseData.advocate?.toString() === user._id.toString();

    if (!isClient && !isAdvocate) {
        throw ApiError.forbidden("You don't have access to this case");
    }

    const uploaderType = user.role === USER_ROLES.CLIENT ? 'client' : 'Advocate';

    await caseData.addDocument(
        { url, type, filename, description },
        user._id,
        uploaderType
    );

    return ApiResponse.success({
        document: caseData.documents[caseData.documents.length - 1]
    }, "Document added successfully").send(res);
});

/**
 * Get case statistics (for dashboard)
 * @route GET /api/cases/stats
 * @access Protected
 */
export const getCaseStats = asyncHandler(async (req, res) => {
    const user = req.user;

    const matchQuery = user.role === USER_ROLES.CLIENT 
        ? { client: user._id }
        : { advocate: user._id };

    const stats = await CaseModel.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    // Format stats
    const formattedStats = {
        total: 0,
        pending: 0,
        accepted: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0,
        rejected: 0
    };

    stats.forEach(stat => {
        formattedStats[stat._id] = stat.count;
        formattedStats.total += stat.count;
    });

    // Get recent activity
    const recentCases = await CaseModel.find(matchQuery)
        .select('caseNumber title status updatedAt')
        .sort({ updatedAt: -1 })
        .limit(5);

    return ApiResponse.success({
        stats: formattedStats,
        recentCases
    }, "Case statistics retrieved successfully").send(res);
});

export default {
    createCase,
    getCases,
    getCaseById,
    updateCaseStatus,
    acceptCase,
    rejectCase,
    addDocument,
    getCaseStats
};
