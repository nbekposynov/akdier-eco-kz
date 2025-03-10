import FinalProcessingService from '../api/FinalProcessingService';

export default function useExportFinalProcessingReport() {
    const exportReport = async (filters) => {
        try {
            await FinalProcessingService.exportReport(filters);
        } catch (error) {
            console.error('Ошибка при экспорте отчета:', error);
        }
    };

    return { exportReport };
}
