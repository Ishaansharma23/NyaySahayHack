import mongoose from "mongoose";
import { CASE_STATUS, URGENCY_LEVELS } from "../utils/constants.js";

/**
 * Case Model
 * Represents a legal case between client and advocate
 */
const caseSchema = new mongoose.Schema({
    // Case identification
    caseNumber: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    
    // Parties involved
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    advocate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advocate'
    },
    
    // Case categorization
    caseType: {
        type: String,
        enum: ['civil', 'criminal', 'family', 'property', 'consumer', 'labour', 'corporate', 'constitutional', 'cyber', 'other'],
        required: true
    },
    subCategory: String,
    
    // Status tracking
    status: {
        type: String,
        enum: Object.values(CASE_STATUS),
        default: CASE_STATUS.PENDING
    },
    urgency: {
        type: String,
        enum: Object.values(URGENCY_LEVELS),
        default: URGENCY_LEVELS.MEDIUM
    },
    
    // Related incident (if created from incident report)
    relatedIncident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Incident'
    },
    
    // Documents and evidence
    documents: [{
        url: String,
        type: {
            type: String,
            enum: ['evidence', 'legal_document', 'id_proof', 'court_order', 'other']
        },
        filename: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'documents.uploaderType'
        },
        uploaderType: {
            type: String,
            enum: ['client', 'Advocate']
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        description: String
    }],
    
    // Case timeline/updates
    updates: [{
        message: {
            type: String,
            required: true
        },
        status: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'updates.updaterType'
        },
        updaterType: {
            type: String,
            enum: ['client', 'Advocate', 'system']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Court details (if applicable)
    courtDetails: {
        courtName: String,
        courtType: {
            type: String,
            enum: ['district', 'high_court', 'supreme_court', 'consumer_forum', 'tribunal', 'other']
        },
        caseFilingNumber: String,
        nextHearingDate: Date,
        judgeName: String
    },
    
    // Financial details
    billing: {
        estimatedFee: Number,
        agreedFee: Number,
        paidAmount: {
            type: Number,
            default: 0
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'partial', 'paid', 'refunded'],
            default: 'pending'
        }
    },
    
    // Important dates
    filedAt: Date,
    acceptedAt: Date,
    resolvedAt: Date,
    closedAt: Date,
    
    // Notes (private to advocate)
    advocateNotes: {
        type: String,
        select: false // Hidden by default
    },
    
    // AI analysis (if generated)
    aiAnalysis: {
        category: String,
        relevantLaws: [String],
        suggestedUrgency: String,
        nextSteps: [String],
        summary: String,
        analyzedAt: Date
    }
    
}, { timestamps: true });

// Indexes for efficient queries
caseSchema.index({ client: 1, status: 1 });
caseSchema.index({ advocate: 1, status: 1 });
caseSchema.index({ createdAt: -1 });

// Generate case number before saving
caseSchema.pre('save', function (next) {
    if (!this.caseNumber) {
        const year = new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.caseNumber = `NS-${year}-${timestamp}${random}`;
    }
    next();
});

// Update status dates
caseSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        const now = new Date();
        switch (this.status) {
            case CASE_STATUS.ACCEPTED:
                this.acceptedAt = now;
                break;
            case CASE_STATUS.RESOLVED:
                this.resolvedAt = now;
                break;
            case CASE_STATUS.CLOSED:
                this.closedAt = now;
                break;
        }
    }
    next();
});

// Virtual for case age
caseSchema.virtual('caseAge').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Method to add update
caseSchema.methods.addUpdate = function(message, updatedBy, updaterType, newStatus = null) {
    this.updates.push({
        message,
        status: newStatus || this.status,
        updatedBy,
        updaterType,
        createdAt: new Date()
    });
    
    if (newStatus) {
        this.status = newStatus;
    }
    
    return this.save();
};

// Method to add document
caseSchema.methods.addDocument = function(docData, uploadedBy, uploaderType) {
    this.documents.push({
        ...docData,
        uploadedBy,
        uploaderType,
        uploadedAt: new Date()
    });
    return this.save();
};

const CaseModel = mongoose.model("Case", caseSchema);
export default CaseModel;
