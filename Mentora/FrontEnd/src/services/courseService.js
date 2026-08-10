import api from './api';

export const courseService = {
  getAll: (params = {}) => api.get('/Cursos', { params }),
  getById: (id) => api.get(`/Cursos/${id}`),
  create: (data) => api.post('/Cursos', data),
  update: (id, data) => api.put(`/Cursos/${id}`, data),
  delete: (id) => api.delete(`/Cursos/${id}`),
  publish: (id) => api.patch(`/Cursos/${id}/publicar`),
  getInstructorCourses: () => api.get('/Dashboard/instructor'),
  getCategories: () => api.get('/Cursos/categorias'),
};

export default courseService;