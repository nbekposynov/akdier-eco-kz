import apiClient from '../utils/apiClient';

const WasteService = {
    // Get all wastes
    getAll: async () => {
        const response = await apiClient.get('/api/wastes');
        return response.data;
    },

    // Get a waste by id
    get: async (id) => {
        const response = await apiClient.get(`/api/wastes/${id}`);
        return response.data;
    },

    // Create a new waste
    create: async (data) => {
        const response = await apiClient.post('/api/wastes', data);
        return response.data;
    },

    // Update a waste
    update: async (id, data) => {
        const response = await apiClient.put(`/api/wastes/${id}`, data);
        return response.data;
    },

    // Delete a waste
    delete: async (id) => {
        const response = await apiClient.delete(`/api/wastes/${id}`);
        return response.data;
    },

    // Get final waste types
    getFinalWasteTypes: async () => {
        const response = await apiClient.get('/api/final-waste-types');
        return response.data;
    }
};

export default WasteService;
