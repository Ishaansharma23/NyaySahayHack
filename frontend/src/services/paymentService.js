/**
 * Payment Service
 * API wrappers for payment operations
 */
import api from './api';

const paymentService = {
    createOrder: async (payload) => {
        const response = await api.post('/payments/create-order', payload);
        return response.data;
    },

    verifyPayment: async (payload) => {
        const response = await api.post('/payments/verify', payload);
        return response.data;
    },

    getPayments: async () => {
        const response = await api.get('/payments');
        return response.data;
    },

    getEarnings: async () => {
        const response = await api.get('/payments/earnings');
        return response.data;
    }
};

export default paymentService;
