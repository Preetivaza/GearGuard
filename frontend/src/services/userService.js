import api from './api';

// Get current user profile
export const getProfile = async () => {
    try {
        const response = await api.get('/users/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// Update user profile
export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export default {
    getProfile,
    updateProfile
};
