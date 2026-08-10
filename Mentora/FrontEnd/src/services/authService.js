import api from './api';

export const authService = {
  login: (correo, password) => api.post('/auth/login', { correo, password }),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export default authService;