import api from './api.js';

export const authService = {
    // Register client
    registerClient: async (userData) => {
        try {
            const response = await api.post('/auth/signup/client', userData);
            if (response.data?.token) {
                window.localStorage.setItem('authToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login client
    loginClient: async (credentials) => {
        try {
            const response = await api.post('/auth/login/client', credentials);
            if (response.data?.token) {
                window.localStorage.setItem('authToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Logout client
    logoutClient: async () => {
        try {
            const response = await api.post('/auth/logout/client');
            window.localStorage.removeItem('authToken');
            return response.data;
        } catch (error) {
            window.localStorage.removeItem('authToken');
            throw error.response?.data || { message: 'Logout failed' };
        }
    },

    // Client onboarding
    onboardingClient: async (formData) => {
        try {
            const response = await api.put('/auth/onboarding/client', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Onboarding failed' };
        }
    },

    // Register advocate
    registerAdvocate: async (userData) => {
        try {
            const response = await api.post('/auth/signup/advocate', userData);
            if (response.data?.token) {
                window.localStorage.setItem('authToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login advocate
    loginAdvocate: async (credentials) => {
        try {
            const response = await api.post('/auth/login/advocate', credentials);
            if (response.data?.token) {
                window.localStorage.setItem('authToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Logout advocate
    logoutAdvocate: async () => {
        try {
            const response = await api.post('/auth/logout/advocate');
            window.localStorage.removeItem('authToken');
            return response.data;
        } catch (error) {
            window.localStorage.removeItem('authToken');
            throw error.response?.data || { message: 'Logout failed' };
        }
    },

    // Advocate onboarding
    onboardingAdvocate: async (formData) => {
        try {
            const response = await api.put('/auth/onboarding/advocate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Onboarding failed' };
        }
    },

    // Check authentication status
    checkAuth: async () => {
        try {
            const response = await api.get('/auth/check');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Authentication check failed' };
        }
    },

    // Check profile completion status
    checkProfileStatus: async () => {
        try {
            const response = await api.get('/auth/profile-status');
            return response.data;
        } catch (error) {
            // On any error (network, server), return unauthenticated state
            // This prevents crashes and allows graceful handling
            return {
                authenticated: false,
                user: null,
                role: null,
                profileComplete: false
            };
        }
    },

    // Get current user (client specific)
    getCurrentClient: async () => {
        try {
            const response = await api.get('/auth/me/client');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get client data' };
        }
    },

    // Get current user (advocate specific)
    getCurrentAdvocate: async () => {
        try {
            const response = await api.get('/auth/me/advocate');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get advocate data' };
        }
    },
};