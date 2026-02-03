import mongoose from "mongoose";

/**
 * Payment Model
 * Tracks all financial transactions on the platform
 */
const paymentSchema = new mongoose.Schema({
    // Transaction identification
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    
    // Parties involved
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    advocate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advocate',
        required: true
    },
    
    // Related case
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    },
    
    // Payment details
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    
    // Payment type
    paymentType: {
        type: String,
        enum: ['consultation', 'case_fee', 'retainer', 'document_fee', 'court_fee', 'other'],
        required: true
    },
    description: String,
    
    // Payment status
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending'
    },
    
    // Payment gateway details
    paymentGateway: {
        type: String,
        enum: ['razorpay', 'stripe', 'paytm', 'upi', 'bank_transfer', 'cash'],
        required: true
    },
    gatewayOrderId: String,
    gatewayPaymentId: String,
    gatewaySignature: String,
    
    // Platform fee (commission)
    platformFee: {
        type: Number,
        default: 0
    },
    platformFeePercentage: {
        type: Number,
        default: 10 // 10% platform fee
    },
    advocateAmount: {
        type: Number // Amount after platform fee deduction
    },
    
    // Invoice details
    invoiceNumber: String,
    invoiceUrl: String,
    
    // Payment completion
    paidAt: Date,
    refundedAt: Date,
    refundReason: String,
    
    // Metadata
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
    
}, { timestamps: true });

// Indexes
paymentSchema.index({ client: 1, status: 1 });
paymentSchema.index({ advocate: 1, status: 1 });
paymentSchema.index({ case: 1 });
paymentSchema.index({ createdAt: -1 });

// Generate transaction ID before saving
paymentSchema.pre('save', function (next) {
    if (!this.transactionId) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.transactionId = `TXN${timestamp}${random}`;
    }
    
    // Calculate advocate amount after platform fee
    if (this.amount && !this.advocateAmount) {
        this.platformFee = (this.amount * this.platformFeePercentage) / 100;
        this.advocateAmount = this.amount - this.platformFee;
    }
    
    next();
});

// Generate invoice number
paymentSchema.pre('save', function (next) {
    if (!this.invoiceNumber && this.status === 'completed') {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.invoiceNumber = `INV-${year}${month}-${random}`;
    }
    next();
});

// Method to mark as completed
paymentSchema.methods.markCompleted = function(gatewayPaymentId, gatewaySignature) {
    this.status = 'completed';
    this.gatewayPaymentId = gatewayPaymentId;
    this.gatewaySignature = gatewaySignature;
    this.paidAt = new Date();
    return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = function(reason) {
    this.status = 'refunded';
    this.refundedAt = new Date();
    this.refundReason = reason;
    return this.save();
};

const PaymentModel = mongoose.model("Payment", paymentSchema);
export default PaymentModel;
