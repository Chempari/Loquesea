import api from './api';

export const uploadService = {
  uploadProfilePhoto: (file) => {
    const fd = new FormData();
    fd.append('foto', file);
    return api.post('/uploads/profile-photo', fd);
  },
  uploadCourseCover: (file) => {
    const fd = new FormData();
    fd.append('imagen', file);
    return api.post('/uploads/course-cover', fd);
  },
  uploadLessonVideo: (file) => {
    const fd = new FormData();
    fd.append('video', file);
    return api.post('/uploads/lesson-video', fd);
  },
};

export default uploadService;