import api from './api';

// Get dashboard statistics
export const getDashboardStats = async () => {
    try {
        const response = await api.get('/stats/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

// Get recent activities
export const getRecentActivities = async () => {
    try {
        const response = await api.get('/stats/recent-activities');
        return response.data;
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        throw error;
    }
};

export default {
    getDashboardStats,
    getRecentActivities
};
