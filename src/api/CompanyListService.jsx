import apiClient from '../utils/apiClient';

const CompanyListService = {
    getAll: async (moderatorId = null) => {
        // Add moderator_id as query parameter if provided
        const params = moderatorId ? { moderator_id: moderatorId } : {};
        const response = await apiClient.get(`/api/v1/companies/list`, { params });
        return response.data;
    },

    getByModerator: async (moderatorId) => {
        if (!moderatorId) {
            throw new Error("Moderator ID is required");
        }
        const response = await apiClient.get(`/api/v1/companies/list`, {
            params: { moderator_id: moderatorId }
        });
        return response.data;
    }
};

export default CompanyListService;
