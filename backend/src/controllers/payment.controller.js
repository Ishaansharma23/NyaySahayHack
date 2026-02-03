import PaymentModel from '../models/Payment.model.js';
import CaseModel from '../models/Case.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../service/payment.service.js';
import { USER_ROLES } from '../utils/constants.js';

/**
 * Create payment order (Razorpay)
 * @route POST /api/payments/create-order
 * @access Client
 */
export const createPaymentOrder = asyncHandler(async (req, res) => {
    const { amount, caseId, advocateId, paymentType, description } = req.body;
    const user = req.user;

    if (user.role !== USER_ROLES.CLIENT) {
        throw ApiError.forbidden('Only clients can initiate payments');
    }

    if (!amount || amount <= 0) {
        throw ApiError.badRequest('Valid amount is required');
    }

    if (!advocateId) {
        throw ApiError.badRequest('Advocate is required for payment');
    }

    const receipt = `RCT-${Date.now()}`;
    const order = await createRazorpayOrder({ amount, receipt });

    const payment = await PaymentModel.create({
        client: user._id,
        advocate: advocateId,
        case: caseId || undefined,
        amount,
        currency: 'INR',
        paymentType: paymentType || 'consultation',
        description,
        paymentGateway: 'razorpay',
        gatewayOrderId: order.id,
        status: 'pending'
    });

    return ApiResponse.success({
        order,
        payment: {
            _id: payment._id,
            transactionId: payment.transactionId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            gatewayOrderId: payment.gatewayOrderId
        }
    }, 'Payment order created').send(res);
});

/**
 * Verify payment (Razorpay)
 * @route POST /api/payments/verify
 * @access Client
 */
export const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
        throw ApiError.badRequest('Payment verification data missing');
    }

    const payment = await PaymentModel.findOne({ gatewayOrderId: orderId });
    if (!payment) {
        throw ApiError.notFound('Payment not found');
    }

    const isValid = verifyRazorpaySignature({ orderId, paymentId, signature });
    if (!isValid) {
        throw ApiError.badRequest('Invalid payment signature');
    }

    await payment.markCompleted(paymentId, signature);

    // Update case billing if linked
    if (payment.case) {
        const caseRecord = await CaseModel.findById(payment.case);
        if (caseRecord) {
            caseRecord.billing = caseRecord.billing || {};
            caseRecord.billing.paidAmount = (caseRecord.billing.paidAmount || 0) + payment.amount;
            caseRecord.billing.paymentStatus = 'paid';
            await caseRecord.save();
        }
    }

    return ApiResponse.success({
        paymentId: payment._id,
        status: payment.status
    }, 'Payment verified').send(res);
});

/**
 * Get payments for current user
 * @route GET /api/payments
 * @access Protected
 */
export const getPayments = asyncHandler(async (req, res) => {
    const user = req.user;

    const query = user.role === USER_ROLES.CLIENT
        ? { client: user._id }
        : { advocate: user._id };

    const payments = await PaymentModel.find(query)
        .populate('advocate', 'fullName email')
        .populate('client', 'fullName email')
        .populate('case', 'caseNumber title')
        .sort({ createdAt: -1 });

    return ApiResponse.success({ payments }, 'Payments retrieved').send(res);
});

/**
 * Get advocate earnings summary
 * @route GET /api/payments/earnings
 * @access Advocate
 */
export const getEarnings = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.role !== USER_ROLES.ADVOCATE) {
        throw ApiError.forbidden('Only advocates can access earnings');
    }

    const payments = await PaymentModel.find({
        advocate: user._id,
        status: 'completed'
    }).sort({ createdAt: -1 });

    const totalEarnings = payments.reduce((sum, p) => sum + (p.advocateAmount || 0), 0);

    return ApiResponse.success({
        totalEarnings,
        payments
    }, 'Earnings retrieved').send(res);
});

export default {
    createPaymentOrder,
    verifyPayment,
    getPayments,
    getEarnings
};
