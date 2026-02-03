/**
 * Payment Query Hooks
 * React Query hooks for payments and earnings
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import paymentService from '../services/paymentService';
import toast from 'react-hot-toast';

const PAYMENT_KEYS = {
    all: ['payments'],
    earnings: ['payments', 'earnings']
};

export const usePayments = () => {
    return useQuery({
        queryKey: PAYMENT_KEYS.all,
        queryFn: async () => {
            const response = await paymentService.getPayments();
            return response.data;
        },
        staleTime: 60 * 1000
    });
};

export const useEarnings = (enabled = true) => {
    return useQuery({
        queryKey: PAYMENT_KEYS.earnings,
        queryFn: async () => {
            const response = await paymentService.getEarnings();
            return response.data;
        },
        staleTime: 60 * 1000,
        enabled
    });
};

export const useCreatePaymentOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => paymentService.createOrder(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create payment order');
        }
    });
};

export const useVerifyPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => paymentService.verifyPayment(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
            toast.success('Payment successful');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Payment verification failed');
        }
    });
};

export default {
    usePayments,
    useEarnings,
    useCreatePaymentOrder,
    useVerifyPayment
};
