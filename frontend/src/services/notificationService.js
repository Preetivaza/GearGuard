import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get user notifications
export const getNotifications = async (params = {}) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
    };
    const response = await axios.get(`${API_URL}/notifications`, config);
    return response.data;
};

// Mark notification as read
export const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.patch(`${API_URL}/notifications/${id}/read`, {}, config);
    return response.data;
};

// Mark all as read
export const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.patch(`${API_URL}/notifications/read-all`, {}, config);
    return response.data;
};

// Delete notification
export const deleteNotification = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/notifications/${id}`, config);
    return response.data;
};
