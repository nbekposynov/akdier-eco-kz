import { useState, useEffect, useCallback } from 'react';
import CompanyListService from '../api/CompanyListService';

const useCompaniesList = (moderatorId = null) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCompanies = useCallback(async (modId = moderatorId) => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (modId) {
                // If moderator ID is provided, fetch companies for this moderator
                data = await CompanyListService.getByModerator(modId);
            } else {
                // Otherwise fetch all companies
                data = await CompanyListService.getAll();
            }
            setCompanies(data);
        } catch (err) {
            console.error('Error fetching companies:', err);
            setError(err.message || 'Error fetching companies');
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    }, [moderatorId]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    // Function to refresh companies when moderator changes
    const refreshCompaniesByModerator = useCallback((newModeratorId) => {
        return fetchCompanies(newModeratorId);
    }, [fetchCompanies]);

    return {
        companies,
        loading,
        error,
        refreshCompaniesByModerator
    };
};

export default useCompaniesList;
