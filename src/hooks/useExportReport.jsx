import { useCallback } from 'react';
import ReportServiceExcel from '../api/ReportServiceExcel';
const useExportReport = () => {
    const exportReport = useCallback(async (filters) => {
        if (!filters.start_date || !filters.end_date || !filters.moderator_id) {
            throw new Error('Не все обязательные фильтры заполнены.');
        }
        await ReportServiceExcel.exportToExcel(filters);
    }, []);

    return { exportReport };
};

export default useExportReport;
