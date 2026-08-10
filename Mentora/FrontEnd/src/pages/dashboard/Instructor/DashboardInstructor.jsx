import { useState, useEffect } from 'react';
import api from '../../../Api/axios';
import { InstructorHeader } from './components/InstructorHeader';
import { InstructorCourses } from './components/InstructorCourses';
import { SummaryCard } from '../shared';
import './DashboardInstructor.css';
import '../shared/dashboard-shared.css';

export function DashboardInstructor() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/Dashboard/instructor')
      .then((res) => setData(res.data))
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || 'Error al cargar dashboard';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const togglePublicado = async (curso) => {
    try {
      const res = await api.patch(`/Cursos/${curso?._id}/publicar`);
      setData((prev) => prev ? {
        ...prev,
        cursos: prev.cursos.map((c) => c._id === curso?._id ? res.data?.curso || c : c)
      } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="dash-loading">Cargando...</div>;
  if (error) return <div className="dash-error">{error}</div>;

  const resumen = data?.resumen || {};
  const cursos = data?.cursos || [];

  return (
    <div className="dashboard-instructor">
      <InstructorHeader />

      <div className="summary-cards">
        <SummaryCard value={resumen.total_cursos ?? 0} label="Cursos totales" />
        <SummaryCard value={resumen.cursos_publicados ?? 0} label="Publicados" />
        <SummaryCard value={resumen.total_estudiantes ?? 0} label="Estudiantes" />
        <SummaryCard value={resumen.calificacion_promedio_global ?? 0} label="Calif. promedio" />
      </div>

      <h2 className="dashboard-instructor__section-title">Mis cursos</h2>
      <InstructorCourses cursos={cursos} onTogglePublicado={togglePublicado} />
    </div>
  );
}
