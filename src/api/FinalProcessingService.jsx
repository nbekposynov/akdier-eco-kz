import apiClient from '../utils/apiClient';

const FinalProcessingService = {
    getReport: (filters) => {
        return apiClient.get('/api/v1/management/final-processing-reports', {
            params: {
                ...filters,
                view_type: 'operations'
            }
        });
    },

    exportReport: async (filters) => {
        try {
            const response = await apiClient.get('/api/v1/management/final-processing-reports/excel', {
                params: {
                    ...filters,
                    view_type: 'operations'
                },
                responseType: 'blob',
            });

            // Create download link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'FinalProcessingReport.xlsx');
            document.body.appendChild(link);
            link.click();

            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);

            return true;
        } catch (error) {
            console.error('Ошибка при экспорте отчета:', error);
            throw error;
        }
    },
};

export default FinalProcessingService;
