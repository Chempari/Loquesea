import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services';
import { useAuth } from './useAuth';

export function useReviews(courseId) {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError('');
    try {
      const res = await reviewService.getByCourse(courseId);
      setResenas(res.data?.resenas || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  return { resenas, loading, error, load };
}

export function useReviewForm(courseId) {
  const { user } = useAuth();
  const [nuevaCalif, setNuevaCalif] = useState(0);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!user || !courseId || nuevaCalif < 1) return;
    setEnviando(true);
    setMessage('');
    try {
      await reviewService.create({
        curso_id: courseId,
        calificacion: nuevaCalif,
        comentario: nuevoComentario,
      });
      setMessage('Reseña enviada.');
      setNuevaCalif(0);
      setNuevoComentario('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al enviar reseña');
    } finally {
      setEnviando(false);
    }
  };

  return {
    nuevaCalif,
    setNuevaCalif,
    nuevoComentario,
    setNuevoComentario,
    enviando,
    message,
    setMessage,
    submit,
    canSubmit: user?.rol === 'estudiante' && nuevaCalif >= 1,
  };
}