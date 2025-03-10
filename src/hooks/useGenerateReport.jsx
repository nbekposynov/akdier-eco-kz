import { useState, useEffect } from 'react';
import WasteServiceType from '../api/WasteServiceType';

const useGenerateReport = (filters) => {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Проверка: есть ли данные для фильтров
        if (!filters || Object.keys(filters).length === 0) {
            console.log('No filters applied, skipping fetch.');
            setReport([]); // Пустой результат
            return;
        }

        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('Fetching with filters:', filters);
                const data = await WasteServiceType.generateReport(filters);
                console.log('Report fetched:', data);
                setReport(data);
            } catch (err) {
                console.error('Error fetching report:', err);
                setError(err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [filters]);

    return { report, loading, error };
};

export default useGenerateReport;
