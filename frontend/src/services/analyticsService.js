import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get equipment analytics
export const getEquipmentAnalytics = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/stats/equipment-analytics`, config);
    return response.data;
};

// Get request trends
export const getRequestTrends = async (months = 6) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: { months },
    };
    const response = await axios.get(`${API_URL}/stats/request-trends`, config);
    return response.data;
};

// Get cost analytics
export const getCostAnalytics = async (months = 12) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: { months },
    };
    const response = await axios.get(`${API_URL}/stats/cost-analytics`, config);
    return response.data;
};

// Get SLA compliance
export const getSLACompliance = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/stats/sla-compliance`, config);
    return response.data;
};

// Get team performance
export const getTeamPerformance = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/stats/team-performance`, config);
    return response.data;
};
