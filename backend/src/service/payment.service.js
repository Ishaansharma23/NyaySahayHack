import Razorpay from 'razorpay';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';

const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    : null;

export const createRazorpayOrder = async ({ amount, currency = 'INR', receipt }) => {
    if (!razorpayInstance) {
        throw ApiError.internal('Razorpay is not configured');
    }

    const order = await razorpayInstance.orders.create({
        amount: Math.round(amount * 100), // convert to paise
        currency,
        receipt,
        payment_capture: 1
    });

    return order;
};

export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
    if (!process.env.RAZORPAY_KEY_SECRET) {
        throw ApiError.internal('Razorpay secret is not configured');
    }

    const hmac = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return hmac === signature;
};

export default {
    createRazorpayOrder,
    verifyRazorpaySignature
};
