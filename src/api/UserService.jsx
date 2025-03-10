import apiClient from '../utils/apiClient';

export class UserService {
    static async getUsers(params = {}) {
        return apiClient.get('/api/v1/users', { params });
    }

    static async updateUser(id, userData) {
        return apiClient.put(`/api/v1/users/${id}`, userData);
    }

    static async deleteUser(id) {
        return apiClient.delete(`/api/v1/users/${id}`);
    }

    static async createUser(userData) {
        return apiClient.post(`/api/register`, userData);
    }

    static async getModeratorCompanies(moderatorId) {
        return apiClient.get(`/api/v1/moderators/${moderatorId}/companies`);
    }
}

export default apiClient;
