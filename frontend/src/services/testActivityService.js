import api from './api';

// Get all test activities
export const getTestActivities = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/test-activities?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching test activities:', error);
        throw error;
    }
};

// Get single test activity
export const getTestActivity = async (id) => {
    try {
        const response = await api.get(`/test-activities/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching test activity:', error);
        throw error;
    }
};

// Create test activity
export const createTestActivity = async (data) => {
    try {
        const response = await api.post('/test-activities', data);
        return response.data;
    } catch (error) {
        console.error('Error creating test activity:', error);
        throw error;
    }
};

// Update test activity
export const updateTestActivity = async (id, data) => {
    try {
        const response = await api.put(`/test-activities/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating test activity:', error);
        throw error;
    }
};

// Delete test activity
export const deleteTestActivity = async (id) => {
    try {
        const response = await api.delete(`/test-activities/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting test activity:', error);
        throw error;
    }
};

// Get equipment test history
export const getEquipmentTestHistory = async (equipmentId) => {
    try {
        const response = await api.get(`/test-activities/equipment/${equipmentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching equipment test history:', error);
        throw error;
    }
};

// Get test activity statistics
export const getTestActivityStats = async () => {
    try {
        const response = await api.get('/test-activities/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching test activity stats:', error);
        throw error;
    }
};

export default {
    getTestActivities,
    getTestActivity,
    createTestActivity,
    updateTestActivity,
    deleteTestActivity,
    getEquipmentTestHistory,
    getTestActivityStats
};
