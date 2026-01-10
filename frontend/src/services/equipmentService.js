import api from './api';

export const equipmentService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/equipment?${params}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/equipment/${id}`);
        return response.data;
    },

    create: async (equipmentData) => {
        const response = await api.post('/equipment', equipmentData);
        return response.data;
    },

    update: async (id, equipmentData) => {
        const response = await api.put(`/equipment/${id}`, equipmentData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/equipment/${id}`);
        return response.data;
    },

    scrap: async (id) => {
        const response = await api.put(`/equipment/${id}/scrap`);
        return response.data;
    },

    getRequests: async (id) => {
        const response = await api.get(`/equipment/${id}/requests`);
        return response.data;
    },
};
