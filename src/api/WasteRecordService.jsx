import axios from "axios";
import apiClient from '../utils/apiClient';

const API_URL = import.meta.env.VITE_API_URL;

const WasteRecordService = {
    // Получить все отходы
    async getWastes() {
        const response = await apiClient.get(`/api/wastes`);
        return response.data;
    },

    // Создать запись об отходах
    async createWasteRecord(data) {
        const response = await apiClient.post(`/api/v1/management/waste-records`, data);
        return response.data;
    },

    // Обновить запись об отходах
    async updateWasteRecord(id, data) {
        const response = await apiClient.put(`/api/v1/management/waste-records/${id}`, data);
        return response.data;
    },

    // Удалить запись об отходах
    async deleteWasteRecord(id) {
        const response = await apiClient.delete(`/api/v1/management/waste-records/${id}`);
        return response.data;
    },

    // Получить записи об отходах с фильтрацией
    async filterWasteRecords(filters) {
        const params = new URLSearchParams(filters).toString(); // Преобразуем фильтры в строку запроса
        const response = await apiClient.get(`/api/v1/management/waste-records/filter?${params}`);
        return response.data;
    },

    // Получить запись об отходах по ID
    async getWasteRecordById(id) {
        const response = await apiClient.get(`/api/v1/management/waste-records/${id}`);
        return response.data;
    },
};

export default WasteRecordService;
