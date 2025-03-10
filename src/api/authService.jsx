import { authClient } from '../utils/apiClient';

export const login = async (email, password) => {
    try {
        console.log("Sending login request for email:", email);
        const response = await authClient.post(`/api/login`, { email, password });

        console.log("Login API response:", response);

        // Проверка на наличие важных данных
        if (!response.data || !response.data.token || !response.data.user) {
            console.error("Invalid API response format:", response.data);
            throw new Error("Некорректный ответ от сервера авторизации");
        }

        return response.data;
    } catch (error) {
        console.error("Login API error:", error);

        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);

            // Форматируем сообщение об ошибке на основе ответа сервера
            const errorMessage = error.response.data.message || `Ошибка авторизации (${error.response.status})`;
            throw new Error(errorMessage);
        }

        throw new Error('Ошибка сети или соединения');
    }
};
