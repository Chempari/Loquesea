import api from './api';

export const enrollmentService = {
  getMyCourses: () => api.get('/Inscripciones/mis-cursos'),
  getByCourse: (courseId) => api.get(`/Inscripciones/curso/${courseId}`),
  enroll: (courseId) => api.post('/Inscripciones', { curso_id: courseId }),
  pay: (courseId) => api.post('/Inscripciones/pagar', { curso_id: courseId }),
  markLessonComplete: (enrollmentId, lessonId) => api.patch(`/Inscripciones/${enrollmentId}/lecciones/${lessonId}`),
  getProgress: (enrollmentId) => api.get(`/Inscripciones/${enrollmentId}/progreso`),
};

export default enrollmentService;