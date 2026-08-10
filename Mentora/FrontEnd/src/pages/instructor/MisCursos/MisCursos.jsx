import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { courseService } from '../../../services';
import { CourseCard } from '../../../components/course/CourseCard';
import { Switch } from '../../../components/ui';
import { Spinner } from '../../../components/ui';

export function MisCursos() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    courseService.getInstructorCourses()
      .then((res) => setCursos(res.data?.cursos || []))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar cursos'))
      .finally(() => setLoading(false));
  }, []);

  const togglePublicado = async (cursoId) => {
    try {
      const res = await courseService.publish(cursoId);
      setCursos((prev) => prev.map((c) => c._id === cursoId ? (res.data?.curso || c) : c));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCurso = async (cursoId) => {
    if (!confirm('Eliminar este curso y todo su contenido?')) return;
    try {
      await courseService.delete(cursoId);
      setCursos((prev) => prev.filter((c) => c._id !== cursoId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  if (loading) return <div className="dashboard-loading">Cargando...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="mis-cursos-page">
      <div className="mis-cursos-header">
        <Link to="/cursos/nuevo" className="btn btn-primary">Crear curso</Link>
      </div>

      {cursos.length === 0 ? (
        <p className="empty-message">No has creado ningún curso.</p>
      ) : (
        <div className="course-list">
          {cursos.map((curso) => (
            <CourseCard
              key={curso._id}
              curso={curso}
              variant="instructor"
              onTogglePublish={() => togglePublicado(curso._id)}
              onEdit={(id) => window.location.href = `/cursos/${id}/editar`}
              onDelete={() => deleteCurso(curso._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MisCursos;