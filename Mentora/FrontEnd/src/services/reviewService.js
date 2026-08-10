import api from './api';

export const reviewService = {
  getByCourse: (courseId) => api.get(`/Cursos/${courseId}/resenas`),
  create: (data) => api.post('/Resenas', data),
  update: (id, data) => api.put(`/Resenas/${id}`, data),
  delete: (id) => api.delete(`/Resenas/${id}`),
};

export default reviewService;