import { useState, useEffect } from 'react';
import ReportService from '../api/ReportService';
import ReportServiceExcel from '../api/reportServiceExcel';

const useModeratorReports = (filters = null) => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Получаем ID модератора из localStorage
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const moderatorId = userInfo.id;

    useEffect(() => {
        if (!filters) return;

        const fetchReports = async () => {
            setLoading(true);
            try {
                // Добавляем ID модератора к фильтрам
                const reportParams = { ...filters, moderator_id: moderatorId };
                const data = await ReportService.getReports(reportParams);
                setReports(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError(err.message || 'Failed to load reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [filters, moderatorId]);

    const exportReport = async (exportFilters) => {
        try {
            // Также добавляем ID модератора к фильтрам экспорта
            const exportParams = { ...exportFilters, moderator_id: moderatorId };
            return await ReportServiceExcel.exportToExcel(exportParams);
        } catch (err) {
            console.error('Error exporting moderator reports:', err);
            throw err;
        }
    };

    return { reports, loading, error, exportReport };
};

export default useModeratorReports;
