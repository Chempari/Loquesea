import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { courseService } from '../../../services';
import { SummaryCard } from '../../../components/dashboard/SummaryCard';
import { InstructorCourseCard } from '../../../components/course/CourseCard';
import { Spinner } from '../../../components/ui';
import './DashboardInstructor.css';

export function DashboardInstructor() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    courseService.getInstructorCourses()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al cargar dashboard');
        setLoading(false);
      });
  }, []);

  const togglePublicado = async (cursoId) => {
    try {
      const res = await courseService.publish(cursoId);
      setData((prev) => prev ? {
        ...prev,
        cursos: prev.cursos.map((c) => c._id === cursoId ? res.data?.curso || c : c)
      } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="dashboard-loading">Cargando...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  const resumen = data?.resumen || {};
  const cursos = data?.cursos || [];

  return (
    <div className="dashboard-instructor">
      <div className="dashboard-instructor__topbar">
        <p className="dashboard-instructor__role">Instructor</p>
        <Link to="/cursos/nuevo" className="dashboard-instructor__create-action">Crear curso</Link>
      </div>

      <div className="summary-cards">
        <SummaryCard value={resumen.total_cursos ?? 0} label="Cursos totales" />
        <SummaryCard value={resumen.cursos_publicados ?? 0} label="Publicados" variant="success" />
        <SummaryCard value={resumen.total_estudiantes ?? 0} label="Estudiantes" />
        <SummaryCard value={resumen.calificacion_promedio_global ?? 0} label="Calif. promedio" variant="warning" />
      </div>

      <h2 className="dashboard-instructor__section-title">Mis cursos</h2>
      {cursos.length === 0 ? (
        <p className="dashboard-instructor__no-courses">
          No has creado ningún curso. <Link to="/cursos/nuevo">Crea uno aquí</Link>
        </p>
      ) : (
        <div className="course-list">
          {cursos.map((curso) => (
            <InstructorCourseCard
              key={curso._id}
              curso={curso}
              onTogglePublish={() => togglePublicado(curso._id)}
              onEdit={(id) => window.location.href = `/cursos/${id}/editar`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardInstructor;