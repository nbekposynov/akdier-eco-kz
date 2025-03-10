import apiClient from '../utils/apiClient';

const WasteCategoryService = {
    getAll: async () => {
        const response = await apiClient.get('/api/waste-categories');
        return response.data;
    },

    get: async (id) => {
        const response = await apiClient.get(`/api/waste-categories/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/api/waste-categories', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/api/waste-categories/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/api/waste-categories/${id}`);
        return response.data;
    }
};

export default WasteCategoryService;
