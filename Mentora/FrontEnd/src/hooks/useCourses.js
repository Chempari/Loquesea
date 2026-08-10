import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services';

export function useCourses(initialFilters = {}) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const loadCursos = useCallback(async (params = filters) => {
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getAll(params);
      const data = res.data.cursos || res.data.data?.cursos || [];
      setCursos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCursos(filters);
  }, [loadCursos, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return { cursos, loading, error, filters, loadCursos, updateFilters, setFilters };
}

export function useCourse(id) {
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    courseService.getById(id)
      .then((res) => {
        const data = res.data?.curso || res.data?.data?.curso || null;
        setCurso(data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar curso'))
      .finally(() => setLoading(false));
  }, [id]);

  return { curso, loading, error, setCurso };
}

export function useInstructorCourses() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getInstructorCourses();
      setCursos(res.data?.cursos || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (cursoId) => {
    try {
      const res = await courseService.publish(cursoId);
      setCursos((prev) => prev.map((c) => c._id === cursoId ? (res.data?.curso || c) : c));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async (cursoId) => {
    try {
      await courseService.delete(cursoId);
      setCursos((prev) => prev.filter((c) => c._id !== cursoId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  return { cursos, loading, error, load, togglePublish, deleteCourse };
}