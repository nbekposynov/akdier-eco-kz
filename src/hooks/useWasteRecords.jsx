import { useState, useEffect } from "react";
import WasteRecordService from "../api/WasteRecordService";

const useWasteRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWasteRecords = async (filters = {}) => {
        setLoading(true);
        try {
            const data = await WasteRecordService.filterWasteRecords(filters);
            setRecords(data.data || []); // Предполагается, что данные находятся в `data.data`
        } catch (err) {
            setError(err.message || "Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    const createWasteRecord = async (data) => {
        try {
            const response = await WasteRecordService.createWasteRecord(data);
            setRecords((prev) => [...prev, response]);
        } catch (err) {
            setError(err.message || "Ошибка при создании записи");
        }
    };

    const updateWasteRecord = async (id, data) => {
        try {
            const response = await WasteRecordService.updateWasteRecord(id, data);
            setRecords((prev) =>
                prev.map((record) =>
                    record.id === id ? response : record
                )
            );
        } catch (err) {
            setError(err.message || "Ошибка при обновлении записи");
        }
    };

    const deleteWasteRecord = async (id) => {
        try {
            await WasteRecordService.deleteWasteRecord(id);
            setRecords((prev) => prev.filter((record) => record.id !== id));
        } catch (err) {
            setError(err.message || "Ошибка при удалении записи");
        }
    };

    useEffect(() => {
        fetchWasteRecords();
    }, []);

    return {
        records,
        loading,
        error,
        fetchWasteRecords,
        createWasteRecord,
        updateWasteRecord,
        deleteWasteRecord,
    };
};

export default useWasteRecords;
