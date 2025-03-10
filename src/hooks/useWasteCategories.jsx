import { useState, useEffect, useCallback } from 'react';
import WasteCategoryService from '../api/WasteCategoryService';

// Use a cache to prevent duplicate requests
const categoryCache = {
    categories: null
};

export default function useWasteCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        // Check if we already have cached data
        if (categoryCache.categories) {
            setCategories(categoryCache.categories);
            return;
        }

        setLoading(true);
        try {
            const data = await WasteCategoryService.getAll();
            setCategories(data);
            // Store in cache
            categoryCache.categories = data;
            setError(null);
        } catch (err) {
            console.error("Error fetching waste categories:", err);
            setError(err.message || 'Error fetching waste categories');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load data when the component mounts
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Method to force refresh the data
    const refreshCategories = useCallback(() => {
        // Clear the cache and fetch new data
        categoryCache.categories = null;
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refreshCategories
    };
}
