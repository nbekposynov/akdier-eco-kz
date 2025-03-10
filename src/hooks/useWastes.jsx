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
        refreshFinalWasteTypes: fetchFinalWasteTypes
    };
}
