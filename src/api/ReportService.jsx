import apiClient from '../utils/apiClient';

const ReportService = {
    // Единый метод для получения отчетов с разными параметрами
    getReports: async (filters) => {
        const response = await apiClient.get('/api/reports', { params: filters });
        return response.data;
    }
};

export default ReportService;
