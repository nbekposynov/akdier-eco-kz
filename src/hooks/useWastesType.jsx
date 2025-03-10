import { useState, useEffect } from 'react';
import WasteServiceType from '../api/WasteServiceType';

const useWastesType = () => {
    const [wastes, setWastes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWastes = async () => {
            try {
                const data = await WasteServiceType.getAllWastes();
                setWastes(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWastes();
    }, []);

    return { wastes, loading, error };
};
export default useWastesType;
