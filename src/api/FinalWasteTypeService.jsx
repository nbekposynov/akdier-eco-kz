import apiClient from '../utils/apiClient';

const FinalWasteTypeService = {
    getAll: async () => {
        const response = await apiClient.get('/api/final-waste-types');
        return response.data;
    },

    get: async (id) => {
        const response = await apiClient.get(`/api/final-waste-types/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/api/final-waste-types', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/api/final-waste-types/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/api/final-waste-types/${id}`);
        return response.data;
    }
};

export default FinalWasteTypeService;
