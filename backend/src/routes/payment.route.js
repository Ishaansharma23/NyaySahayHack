import express from 'express';
import { protectRoute, clientOnly, advocateOnly } from '../middlewares/auth.middleware.js';
import {
    createPaymentOrder,
    verifyPayment,
    getPayments,
    getEarnings
} from '../controllers/payment.controller.js';

const router = express.Router();

router.use(protectRoute);

// Client payment actions
router.post('/create-order', clientOnly, createPaymentOrder);
router.post('/verify', clientOnly, verifyPayment);

// Shared
router.get('/', getPayments);

// Advocate earnings
router.get('/earnings', advocateOnly, getEarnings);

export default router;
