/**
 * Case Query Hooks
 * React Query hooks for case management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

// Query keys
const CASE_KEYS = {
    all: ['cases'],
    list: (filters) => ['cases', 'list', filters],
    detail: (id) => ['cases', 'detail', id],
    stats: ['cases', 'stats']
};

/**
 * Get all cases for current user
 */
export const useCases = (filters = {}) => {
    const { status, page = 1, limit = 10 } = filters;
    
    return useQuery({
        queryKey: CASE_KEYS.list(filters),
        queryFn: async () => {
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            params.append('page', page);
            params.append('limit', limit);
            
            const response = await api.get(`/cases?${params.toString()}`);
            return response.data.data;
        },
        staleTime: 30 * 1000, // 30 seconds
    });
};

/**
 * Get single case by ID
 */
export const useCase = (caseId) => {
    return useQuery({
        queryKey: CASE_KEYS.detail(caseId),
        queryFn: async () => {
            const response = await api.get(`/cases/${caseId}`);
            return response.data.data.case;
        },
        enabled: !!caseId,
    });
};

/**
 * Get case statistics
 */
export const useCaseStats = () => {
    return useQuery({
        queryKey: CASE_KEYS.stats,
        queryFn: async () => {
            const response = await api.get('/cases/stats');
            return response.data.data;
        },
        staleTime: 60 * 1000, // 1 minute
    });
};

/**
 * Create new case (Client only)
 */
export const useCreateCase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (caseData) => {
            const response = await api.post('/cases', caseData);
            return response.data.data.case;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.all });
            toast.success(`Case ${data.caseNumber} created successfully`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create case');
        }
    });
};

/**
 * Accept case (Advocate only)
 */
export const useAcceptCase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ caseId, estimatedFee }) => {
            const response = await api.post(`/cases/${caseId}/accept`, { estimatedFee });
            return response.data.data.case;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.all });
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.detail(data._id) });
            toast.success('Case accepted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to accept case');
        }
    });
};

/**
 * Reject case (Advocate only)
 */
export const useRejectCase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ caseId, reason }) => {
            const response = await api.post(`/cases/${caseId}/reject`, { reason });
            return response.data.data.case;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.all });
            toast.success('Case rejected');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reject case');
        }
    });
};

/**
 * Update case status (Advocate only)
 */
export const useUpdateCaseStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ caseId, status, message }) => {
            const response = await api.patch(`/cases/${caseId}/status`, { status, message });
            return response.data.data.case;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.all });
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.detail(data._id) });
            toast.success('Case status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    });
};

/**
 * Add document to case
 */
export const useAddCaseDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ caseId, documentData }) => {
            const response = await api.post(`/cases/${caseId}/documents`, documentData);
            return response.data.data.document;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.detail(variables.caseId) });
            toast.success('Document added successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add document');
        }
    });
};

export default {
    useCases,
    useCase,
    useCaseStats,
    useCreateCase,
    useAcceptCase,
    useRejectCase,
    useUpdateCaseStatus,
    useAddCaseDocument
};
