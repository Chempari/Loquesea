export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',

  // Public
  HOME: '/',
  EXPLORAR: '/explorar',
  CURSO_PREVIEW: (id) => `/cursos/${id}`,

  // Student
  DASHBOARD_ESTUDIANTE: '/dashboard',
  MIS_CURSOS_ESTUDIANTE: '/mis-cursos',
  CURSO_APRENDIZAJE: (id) => `/cursos/${id}/aprender`,

  // Instructor
  DASHBOARD_INSTRUCTOR: '/dashboard',
  MIS_CURSOS_INSTRUCTOR: '/mis-cursos',
  CURSO_NUEVO: '/cursos/nuevo',
  CURSO_EDITAR: (id) => `/cursos/${id}/editar`,

  // Profile
  PERFIL: '/perfil',

  // Admin (if needed)
  ADMIN: '/admin',
};

export const ROUTE_GROUPS = {
  PUBLIC: [ROUTES.HOME, ROUTES.EXPLORAR],
  AUTH: [ROUTES.LOGIN, ROUTES.REGISTER],
  STUDENT: [
    ROUTES.DASHBOARD_ESTUDIANTE,
    ROUTES.MIS_CURSOS_ESTUDIANTE,
  ],
  INSTRUCTOR: [
    ROUTES.DASHBOARD_INSTRUCTOR,
    ROUTES.MIS_CURSOS_INSTRUCTOR,
    ROUTES.CURSO_NUEVO,
  ],
  PROTECTED: [ROUTES.PERFIL],
};