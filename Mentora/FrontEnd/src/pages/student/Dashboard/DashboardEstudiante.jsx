import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourses, useMyEnrollments } from '../../../hooks';
import { CourseCard } from '../../../components/course/CourseCard';
import { SummaryCard } from '../../../components/dashboard/SummaryCard';
import { Spinner } from '../../../components/ui';
import './DashboardEstudiante.css';

export function DashboardEstudiante() {
  const { cursos, loading: loadingCursos } = useCourses();
  const { inscripciones, loading: loadingInscripciones, error } = useMyEnrollments();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/Dashboard/estudiante')
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const resumen = data?.resumen || { total_cursos: 0, cursos_completados: 0, progreso_promedio: 0 };

  if (loading && !data) return <div className="dashboard-loading">Cargando...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-estudiante">
      <div className="dashboard-header">
        <h1>Panel Estudiante</h1>
        <p className="dashboard-subtitle">Resumen de tu progreso y cursos inscritos</p>
      </div>

      <div className="summary-cards">
        <SummaryCard value={resumen.total_cursos ?? 0} label="Cursos inscritos" />
        <SummaryCard value={resumen.cursos_completados ?? 0} label="Completados" />
        <SummaryCard value={`${resumen.progreso_promedio ?? 0}%`} label="Progreso promedio" />
      </div>

      <h2 className="section-title">Mis cursos</h2>

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
              variant="link"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardEstudiante;