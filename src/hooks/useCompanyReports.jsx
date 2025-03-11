import { useState, useEffect } from 'react';
import ReportService from '../api/ReportService';
import ReportServiceExcel from '../api/ReportServiceExcel';

const useCompanyReports = (filters = null) => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Извлекаем информацию о пользователе из localStorage при каждом вызове хука
    const getUserInfo = () => {
        try {
            const userInfoStr = localStorage.getItem('user_info');
            if (!userInfoStr) {
                console.warn("user_info not found in localStorage");
                return null;
            }

            const userInfo = JSON.parse(userInfoStr);
            console.log("Parsed user info:", userInfo);
            return userInfo;
        } catch (err) {
            console.error("Error parsing user_info:", err);
            return null;
        }
    };

    useEffect(() => {
        if (!filters) return;

        const fetchReports = async () => {
            setLoading(true);
            try {
                // Получаем свежие данные пользователя
                const userInfo = getUserInfo();
                if (!userInfo || !userInfo.id) {
                    setError("Информация о пользователе не найдена. Пожалуйста, перезайдите в систему.");
                    setLoading(false);
                    return;
                }

                // Логирование для отладки
                console.log("Fetching reports with user ID:", userInfo.id);
                console.log("User role:", userInfo.role);

                // Добавляем ID компании к фильтрам
                const reportParams = {
                    ...filters,
                    company_id: userInfo.id,
                    role: userInfo.role // Дополнительно передаем роль
                };

                console.log("Request params:", reportParams);

                const data = await ReportService.getReports(reportParams);
                setReports(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError(err.message || 'Ошибка при загрузке отчетов');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [filters]);

    const exportReport = async (exportFilters) => {
        try {
            // Получаем свежие данные пользователя
            const userInfo = getUserInfo();
            if (!userInfo || !userInfo.id) {
                throw new Error("Информация о пользователе не найдена. Пожалуйста, перезайдите в систему.");
            }

            // Добавляем ID компании к фильтрам экспорта
            const exportParams = {
                ...exportFilters,
                company_id: userInfo.id,
                role: userInfo.role
            };

            console.log("Export params:", exportParams);

            return await ReportServiceExcel.exportToExcel(exportParams);
        } catch (err) {
            console.error('Error exporting company reports:', err);
            throw err;
        }
    };

    return { reports, loading, error, exportReport };
};

export default useCompanyReports;
