import { useState, useCallback } from 'react';
import { UserService } from '../api/UserService';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState({});
    const [filters, setFilters] = useState({});

    const fetchUsers = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const response = await UserService.getUsers(params);
            setUsers(response.data.data);
            setMeta(response.data.meta);
            setFilters(response.data.filters);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при загрузке пользователей');
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (userData) => {
        try {
            setLoading(true);
            const response = await UserService.createUser(userData);
            setUsers(prevUsers => [response.data.user, ...prevUsers]);
            setError(null);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при создании пользователя');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUser = useCallback(async (id, userData) => {
        try {
            setLoading(true);
            const response = await UserService.updateUser(id, userData);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id ? response.data.user : user
                )
            );
            setError(null);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при обновлении пользователя');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id) => {
        try {
            setLoading(true);
            await UserService.deleteUser(id);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при удалении пользователя');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        users,
        loading,
        error,
        meta,
        filters,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser
    };
};
