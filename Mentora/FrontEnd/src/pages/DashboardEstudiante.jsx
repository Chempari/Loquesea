import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Api/axios';

export function DashboardEstudiante() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/Dashboard/estudiante')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-loading">Cargando...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  const { resumen, inscripciones } = data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p className="dashboard-role" style={{ marginBottom: 0 }}>Estudiante</p>
        <Link to="/explorar" className="btn-outline">Explorar cursos</Link>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-value">{resumen.total_cursos}</span>
          <span className="summary-label">Cursos inscritos</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{resumen.cursos_completados}</span>
          <span className="summary-label">Completados</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{resumen.progreso_promedio}%</span>
          <span className="summary-label">Progreso promedio</span>
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, margin: '32px 0 16px' }}>Mis cursos</h2>
      {inscripciones.length === 0 ? (
        <p className="empty-message">
          No estas inscrito en ningun curso. <Link to="/explorar">Explora cursos aqui</Link>
        </p>
      ) : (
        <div className="course-list">
          {inscripciones.map((insc) => (
            <Link to={`/cursos/${insc.curso_id?._id}/aprender`} key={insc._id} className="course-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="course-info">
                <h3>{insc.curso_id?.titulo || 'Curso sin titulo'}</h3>
                <span className="course-category">
                  {insc.curso_id?.categoria} - {insc.curso_id?.nivel}
                </span>
              </div>
              <div className="course-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${insc.porcentaje}%` }} />
                </div>
                <span className="progress-text">{insc.porcentaje}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}