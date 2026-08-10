import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Api/axios';
import './DashboardInstructor.css';

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
    <div className="dashboard-instructor">
      <div className="dashboard-instructor__topbar">
        <p className="dashboard-instructor__role">Instructor</p>
        <Link to="/cursos/nuevo" className="dashboard-instructor__create-action">Crear curso</Link>
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

      <h2 className="dashboard-instructor__section-title">Mis cursos</h2>
      {cursos.length === 0 ? (
        <p className="dashboard-instructor__no-courses">
          No has creado ningun curso. <Link to="/cursos/nuevo">Crea uno aqui</Link>
        </p>
      ) : (
        <div className="course-list">
          {cursos.map((curso) => (
            <div key={curso._id} className="course-card">
              <div className="course-info">
                <h3>{curso.titulo}</h3>
                <div className="switch-wrapper">
                  <button
                    className={`switch ${curso.publicado ? 'on' : ''}`}
                    onClick={() => togglePublicado(curso)}
                    title={curso.publicado ? 'Despublicar' : 'Publicar'}
                  />
                  <span className={`stat ${curso.publicado ? 'published' : 'draft'}`}>
                    {curso.publicado ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>
              <span className="course-category">{curso.categoria} - {curso.nivel}</span>
              <div className="course-stats">
                <span className="stat">{curso.total_inscritos ?? 0} inscritos</span>
                <span className="stat">{curso.calificacion_promedio ?? 0} / 5</span>
                <span className="stat">${curso.precio ?? 0}</span>
              </div>
              <Link to={`/cursos/${curso._id}/editar`} className="btn-outline">
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}