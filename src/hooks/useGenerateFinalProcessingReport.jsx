import { useState, useEffect } from 'react';
import FinalProcessingService from '../api/FinalProcessingService';

export default function useGenerateFinalProcessingReport(filters) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!filters) return;

        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('Отправка запроса с фильтрами:', filters);
                const response = await FinalProcessingService.getReport(filters);
                console.log('Ответ API:', response.data);

                // Transform data if needed to match OperationsDataGrid expected format
                // This is in case the API doesn't return data in the exact format needed
                const formattedData = formatReportDataForOperationsGrid(response.data);
                setReport(formattedData);
            } catch (err) {
                console.error('Ошибка при получении отчета:', err);
                setError(err.message || 'Ошибка загрузки данных');
                setReport(null);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [filters]);

    // Helper function to transform data if needed
    const formatReportDataForOperationsGrid = (data) => {
        // If the data is already in the correct format, return it as-is
        if (data && data.operations && data.wastes && data.companies) {
            return data;
        }

        // Otherwise, transform the data to match the expected format
        // This is a placeholder implementation - adjust based on your actual API response
        if (!data) return null;

        // Example transformation (adjust according to your actual data structure)
        return {
            operations: data.operations || [],
            wastes: data.wastes || [],
            companies: Array.isArray(data.companies) ? data.companies.map(company => ({
                name: company.name,
                operations: company.operations || {},
                total: company.total || 0
            })) : []
        };
    };

    return { report, loading, error };
}
