import axios from 'axios';
import apiClient from '../utils/apiClient';


const ReportServiceExcel = {
    async exportToExcel(filters) {
        try {
            const response = await apiClient.get(`/api/v1/management/reports/excel`, {
                params: filters,
                responseType: 'blob', // Ожидаем бинарный файл
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.xlsx'); // Имя скачиваемого файла
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Ошибка при экспорте отчета:', error);
            throw new Error('Не удалось экспортировать отчет');
        }
    },
};

export default ReportServiceExcel;
