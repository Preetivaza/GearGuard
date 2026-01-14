import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all spare parts
export const getSpareParts = async (params = {}) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
    };
    const response = await axios.get(`${API_URL}/spare-parts`, config);
    return response.data;
};

// Get single spare part
export const getSparePart = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/spare-parts/${id}`, config);
    return response.data;
};

// Create spare part
export const createSparePart = async (data) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(`${API_URL}/spare-parts`, data, config);
    return response.data;
};

// Update spare part
export const updateSparePart = async (id, data) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/spare-parts/${id}`, data, config);
    return response.data;
};

// Adjust stock
export const adjustStock = async (id, data) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.patch(`${API_URL}/spare-parts/${id}/adjust-stock`, data, config);
    return response.data;
};

// Delete spare part
export const deleteSparePart = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/spare-parts/${id}`, config);
    return response.data;
};

// Get low stock parts
export const getLowStockParts = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/spare-parts/alerts/low-stock`, config);
    return response.data;
};
