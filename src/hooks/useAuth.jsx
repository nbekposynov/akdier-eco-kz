import { useState } from 'react';
import { login } from '../api/authService';

const useAuth = () => {
    const [user, setUser] = useState(null);

    const handleLogin = async (email, password) => {
        try {
            // Запрос на вход
            const response = await login(email, password);
            console.log("Raw login response:", response);

            // Проверка структуры ответа
            if (!response || !response.token || !response.user) {
                console.error("Invalid response format:", response);
                throw new Error("Некорректный формат ответа от сервера");
            }

            // Установка локального состояния
            setUser(response.user);

            // Возвращаем полный объект ответа
            return response;
        } catch (error) {
            console.error("Login error in useAuth:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_info');
    };

    return { user, handleLogin, logout };
};

export default useAuth;
