import { useState, useEffect, useCallback } from 'react';
import { enrollmentService } from '../services';
import { useAuth } from './useAuth';

export function useEnrollment(courseId) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const checkEnrollment = useCallback(async () => {
    if (!user || !courseId || user.rol !== 'estudiante') {
      setChecking(false);
      return;
    }
    try {
      const res = await enrollmentService.getMyCourses();
      const inscripciones = res.data?.inscripciones || [];
      const estaInscrito = inscripciones.some((insc) => insc.curso_id?._id === courseId);
      setEnrolled(estaInscrito);
    } catch (err) {
      console.error('Error al verificar inscripción:', err);
    } finally {
      setChecking(false);
    }
  }, [user, courseId]);

  useEffect(() => { checkEnrollment(); }, [checkEnrollment]);

  const enroll = async () => {
    if (!user || !courseId) return;
    setEnrolling(true);
    setMessage('');
    setError('');
    try {
      const res = await enrollmentService.enroll(courseId);
      if (res.data.requiere_pago) {
        setMessage('Este curso requiere pago. Redirigiendo al pago simulado...');
        try {
          await enrollmentService.pay(courseId);
          setEnrolled(true);
          setMessage('¡Inscripción exitosa!');
        } catch (payErr) {
          setError(payErr.response?.data?.message || 'Error en el pago');
        }
      } else {
        setEnrolled(true);
        setMessage('¡Inscripción exitosa!');
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('Ya estas inscrito')) {
        setEnrolled(true);
        setMessage('Ya estás inscrito en este curso.');
      } else {
        setError(err.response?.data?.message || 'Error al inscribirse');
      }
    } finally {
      setEnrolling(false);
    }
  };

  return { enrolled, checking, enrolling, message, error, enroll, checkEnrollment };
}

export function useMyEnrollments() {
  const { user } = useAuth();
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await enrollmentService.getMyCourses();
      setInscripciones(res.data?.inscripciones || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar inscripciones');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return { inscripciones, loading, error, load };
}

export function useCourseProgress(enrollmentId) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!enrollmentId) return;
    setLoading(true);
    try {
      const res = await enrollmentService.getProgress(enrollmentId);
      setProgress(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  useEffect(() => { load(); }, [load]);

  const markLessonComplete = async (lessonId) => {
    try {
      const res = await enrollmentService.markLessonComplete(enrollmentId, lessonId);
      setProgress((prev) => ({
        ...prev,
        progreso: res.data.progreso,
        porcentaje: res.data.porcentaje,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return { progress, loading, markLessonComplete };
}