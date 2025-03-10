import axios from 'axios';
import apiClient from '../utils/apiClient';


const ModeratorListService = {
    getAll: async () => {
        const response = await apiClient.get(`/api/v1/moderators/list`);
        return response.data;
    },
};

export default ModeratorListService;
