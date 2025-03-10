import { useState, useEffect } from 'react';
import FinalWasteTypeService from '../api/FinalWasteTypeService';

const useFinalWasteTypes = () => {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const data = await FinalWasteTypeService.getAll();
            setTypes(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const createType = async (type) => {
        try {
            const response = await FinalWasteTypeService.create(type);
            setTypes((prev) => [...prev, response.data]);
        } catch (err) {
            setError(err);
        }
    };

    const updateType = async (id, type) => {
        try {
            const response = await FinalWasteTypeService.update(id, type);
            setTypes((prev) =>
                prev.map((item) => (item.id === id ? response.data : item))
            );
        } catch (err) {
            setError(err);
        }
    };

    const deleteType = async (id) => {
        try {
            await FinalWasteTypeService.delete(id);
            setTypes((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    return {
        types,
        loading,
        error,
        createType,
        updateType,
        deleteType,
    };
};

export default useFinalWasteTypes;
