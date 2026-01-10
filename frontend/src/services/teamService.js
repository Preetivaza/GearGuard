import api from './api';

export const teamService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/teams?${params}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/teams/${id}`);
        return response.data;
    },

    create: async (teamData) => {
        const response = await api.post('/teams', teamData);
        return response.data;
    },

    update: async (id, teamData) => {
        const response = await api.put(`/teams/${id}`, teamData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/teams/${id}`);
        return response.data;
    },

    addMember: async (id, userId) => {
        const response = await api.put(`/teams/${id}/members`, { userId });
        return response.data;
    },

    removeMember: async (id, userId) => {
        const response = await api.delete(`/teams/${id}/members/${userId}`);
        return response.data;
    },
};
