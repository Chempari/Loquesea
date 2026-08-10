import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { enrollmentService } from '../../../services';
import { CourseCard } from '../../../components/course/CourseCard';
import { ProgressBar } from '../../../components/ui';
import { Spinner } from '../../../components/ui';
import './MisCursos.css';

export function MisCursos() {
  const { user } = useAuth();
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    enrollmentService.getMyCourses()
      .then((res) => setInscripciones(res.data?.inscripciones || []))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar cursos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-loading">Cargando...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="mis-cursos-page">
      <h1>Mis cursos</h1>

      {inscripciones.length === 0 ? (
        <div className="empty-state">
          <p>No estás inscrito en ningún curso.</p>
          <Link to="/explorar" className="btn btn-primary">Explorar cursos</Link>
        </div>
      ) : (
        <div className="courses-grid">
          {inscripciones.map((insc) => (
            <CourseCard
              key={insc._id}
              curso={insc.curso_id}
              variant="student"
              progreso={insc.porcentaje || 0}
              onLearn={(id) => window.location.href = `/cursos/${id}/aprender`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MisCursos;