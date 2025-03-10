import axios from 'axios';
import apiClient from '../utils/apiClient';


const WasteServiceType = {
    generateReport: async (filters) => {
        const response = await apiClient.get(`/api/v1/management/reports`, { params: filters });
        return response.data;
    },
    async getAllWastes() {
        const response = await apiClient.get(`/api/v1/wastes/type`);
        return response.data;
    },
};

export default WasteServiceType;
