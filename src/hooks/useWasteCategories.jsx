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

    // Add method to create a new category
    const createCategory = useCallback(async (categoryData) => {
        setLoading(true);
        try {
            const newCategory = await WasteCategoryService.create(categoryData);

            // Обновляем категории с сервера для получения свежих данных
            const updatedCategories = await WasteCategoryService.getAll();

            setCategories(updatedCategories);
            categoryCache.categories = updatedCategories;

            setError(null);
            return newCategory;
        } catch (err) {
            console.error("Error creating waste category:", err);
            setError(err.message || 'Error creating waste category');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Add method to update a category
    const updateCategory = useCallback(async (id, categoryData) => {
        setLoading(true);
        try {
            const updatedCategory = await WasteCategoryService.update(id, categoryData);

            // Обновляем категории с сервера для получения свежих данных
            const updatedCategories = await WasteCategoryService.getAll();

            setCategories(updatedCategories);
            categoryCache.categories = updatedCategories;

            setError(null);
            return updatedCategory;
        } catch (err) {
            console.error("Error updating waste category:", err);
            setError(err.message || 'Error updating waste category');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Add method to delete a category
    const deleteCategory = useCallback(async (id) => {
        setLoading(true);
        try {
            await WasteCategoryService.delete(id);

            // Обновляем категории с сервера для получения свежих данных
            const updatedCategories = await WasteCategoryService.getAll();

            setCategories(updatedCategories);
            categoryCache.categories = updatedCategories;

            setError(null);
            return true;
        } catch (err) {
            console.error("Error deleting waste category:", err);
            setError(err.message || 'Error deleting waste category');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        categories,
        loading,
        error,
        refreshCategories,
        createCategory,
        updateCategory,
        deleteCategory
    };
}
