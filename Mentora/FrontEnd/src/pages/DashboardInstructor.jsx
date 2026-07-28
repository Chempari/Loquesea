import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Api/axios';

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

  if (loading) return <div className="dashboard-loading">Cargando...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  const resumen = data?.resumen || {};
  const cursos = data?.cursos || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p className="dashboard-role" style={{ marginBottom: 0 }}>Instructor</p>
        <Link to="/cursos/nuevo" className="btn-primary" style={{ width: 'auto', display: 'inline-block', padding: '10px 20px' }}>Crear curso</Link>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-value">{resumen.total_cursos ?? 0}</span>
          <span className="summary-label">Cursos totales</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{resumen.cursos_publicados ?? 0}</span>
          <span className="summary-label">Publicados</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{resumen.total_estudiantes ?? 0}</span>
          <span className="summary-label">Estudiantes</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{resumen.calificacion_promedio_global ?? 0}</span>
          <span className="summary-label">Calif. promedio</span>
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, margin: '32px 0 16px' }}>Mis cursos</h2>
      {cursos.length === 0 ? (
        <p className="empty-message">
          No has creado ningun curso. <Link to="/cursos/nuevo">Crea uno aqui</Link>
        </p>
      ) : (
        <div className="course-list">
          {cursos.map((curso) => (
            <div key={curso._id} className="course-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="course-info" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{curso.titulo}</h3>
                <div className="switch-wrapper">
                  <button
                    className={`switch ${curso.publicado ? 'on' : ''}`}
                    onClick={() => togglePublicado(curso)}
                    title={curso.publicado ? 'Despublicar' : 'Publicar'}
                  />
                  <span className={`stat ${curso.publicado ? 'published' : 'draft'}`} style={{ fontSize: 12 }}>
                    {curso.publicado ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>
              <span className="course-category" style={{ marginBottom: 8 }}>
                {curso.categoria} - {curso.nivel}
              </span>
              <div className="course-stats" style={{ marginBottom: 8 }}>
                <span className="stat">{curso.total_inscritos ?? 0} inscritos</span>
                <span className="stat">{curso.calificacion_promedio ?? 0} / 5</span>
                <span className="stat">${curso.precio ?? 0}</span>
              </div>
              <Link to={`/cursos/${curso._id}/editar`} className="btn-outline" style={{ display: 'inline-block', textDecoration: 'none', fontSize: 13 }}>
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}