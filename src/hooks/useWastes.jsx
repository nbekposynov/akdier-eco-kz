import { useState, useEffect, useCallback } from 'react';
import WasteService from '../api/WasteService';

// Use a cache to prevent duplicate requests
const wasteCache = {
    wastes: null,
    finalWasteTypes: null
};

export default function useWastes() {
    const [wastes, setWastes] = useState([]);
    const [finalWasteTypes, setFinalWasteTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWastes = useCallback(async () => {
        // Check if we already have cached data
        if (wasteCache.wastes) {
            setWastes(wasteCache.wastes);
            return;
        }

        setLoading(true);
        try {
            const data = await WasteService.getAll();
            setWastes(data);
            // Store in cache
            wasteCache.wastes = data;
            setError(null);
        } catch (err) {
            console.error("Error fetching wastes:", err);
            setError(err.message || 'Error fetching wastes');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFinalWasteTypes = useCallback(async () => {
        // Check if we already have cached data
        if (wasteCache.finalWasteTypes) {
            setFinalWasteTypes(wasteCache.finalWasteTypes);
            return;
        }

        setLoading(true);
        try {
            const data = await WasteService.getFinalWasteTypes();
            setFinalWasteTypes(data);
            // Store in cache
            wasteCache.finalWasteTypes = data;
            setError(null);
        } catch (err) {
            console.error("Error fetching final waste types:", err);
            setError(err.message || 'Error fetching final waste types');
        } finally {
            setLoading(false);
        }
    }, []);

    // Add new function to create waste
    const createWaste = useCallback(async (wasteData) => {
        setLoading(true);
        try {
            const newWaste = await WasteService.create(wasteData);

            // После создания, сразу запросите свежие данные с сервера
            // вместо попыток добавить новые данные локально
            wasteCache.wastes = null; // Сбросить кэш
            await fetchWastes(); // Перезагрузить данные

            setError(null);
            return newWaste;
        } catch (err) {
            console.error("Error creating waste:", err);
            setError(err.message || 'Error creating waste');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchWastes]);

    // Похожие изменения для updateWaste и deleteWaste
    const updateWaste = useCallback(async (id, wasteData) => {
        setLoading(true);
        try {
            const updatedWaste = await WasteService.update(id, wasteData);

            // Сбросить кэш и получить свежие данные
            wasteCache.wastes = null;
            await fetchWastes();

            setError(null);
            return updatedWaste;
        } catch (err) {
            console.error("Error updating waste:", err);
            setError(err.message || 'Error updating waste');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchWastes]);

    const deleteWaste = useCallback(async (id) => {
        setLoading(true);
        try {
            await WasteService.delete(id);

            // Сбросить кэш и получить свежие данные
            wasteCache.wastes = null;
            await fetchWastes();

            setError(null);
        } catch (err) {
            console.error("Error deleting waste:", err);
            setError(err.message || 'Error deleting waste');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchWastes]);

    // Load data when the component mounts
    useEffect(() => {
        fetchWastes();
        fetchFinalWasteTypes();
    }, [fetchWastes, fetchFinalWasteTypes]);

    return {
        wastes,
        finalWasteTypes,
        loading,
        error,
        refreshWastes: fetchWastes,
        refreshFinalWasteTypes: fetchFinalWasteTypes,
        createWaste,
        updateWaste,
        deleteWaste
    };
}