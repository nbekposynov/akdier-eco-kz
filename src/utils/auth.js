export const auth = {
    setToken(token) {
        localStorage.setItem('token', token);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    removeToken() {
        localStorage.removeItem('token');
    },

    setUserRole(role) {
        localStorage.setItem('user_role', role);
    },

    getUserRole() {
        return localStorage.getItem('user_role');
    },

    isAdmin() {
        return this.getUserRole() === 'admin';
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};
