import api from './api';

export const requestService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/requests?${params}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/requests/${id}`);
        return response.data;
    },

    create: async (requestData) => {
        const response = await api.post('/requests', requestData);
        return response.data;
    },

    update: async (id, requestData) => {
        const response = await api.put(`/requests/${id}`, requestData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/requests/${id}`);
        return response.data;
    },

    getKanbanData: async () => {
        const response = await api.get('/requests/kanban');
        return response.data;
    },

    getCalendarData: async (month, year) => {
        const params = new URLSearchParams({ month, year });
        const response = await api.get(`/requests/calendar?${params}`);
        return response.data;
    },
};
