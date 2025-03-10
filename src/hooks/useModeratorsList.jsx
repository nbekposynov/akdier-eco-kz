import { useState, useEffect } from 'react';
import ModeratorListService from '../api/ModeratorListService';

const useModeratorsList = () => {
    const [moderators, setModerators] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchModerators = async () => {
            setLoading(true);
            const data = await ModeratorListService.getAll();
            setModerators(data);
            setLoading(false);
        };

        fetchModerators();
    }, []);

    return { moderators, loading };
};

export default useModeratorsList;
