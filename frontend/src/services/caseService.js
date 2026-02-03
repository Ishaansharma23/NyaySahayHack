/**
 * Case Service
 * API service for case management
 */
import api from './api';

const caseService = {
    /**
     * Get all cases for current user
     */
    getCases: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        
        const response = await api.get(`/cases?${params.toString()}`);
        return response.data;
    },

    /**
     * Get single case by ID
     */
    getCaseById: async (caseId) => {
        const response = await api.get(`/cases/${caseId}`);
        return response.data;
    },

    /**
     * Get case statistics
     */
    getCaseStats: async () => {
        const response = await api.get('/cases/stats');
        return response.data;
    },

    /**
     * Create new case (Client only)
     */
    createCase: async (caseData) => {
        const response = await api.post('/cases', caseData);
        return response.data;
    },

    /**
     * Accept case (Advocate only)
     */
    acceptCase: async (caseId, estimatedFee) => {
        const response = await api.post(`/cases/${caseId}/accept`, { estimatedFee });
        return response.data;
    },

    /**
     * Reject case (Advocate only)
     */
    rejectCase: async (caseId, reason) => {
        const response = await api.post(`/cases/${caseId}/reject`, { reason });
        return response.data;
    },

    /**
     * Update case status (Advocate only)
     */
    updateCaseStatus: async (caseId, status, message) => {
        const response = await api.patch(`/cases/${caseId}/status`, { status, message });
        return response.data;
    },

    /**
     * Add document to case
     */
    addDocument: async (caseId, documentData) => {
        const response = await api.post(`/cases/${caseId}/documents`, documentData);
        return response.data;
    }
};

export default caseService;
