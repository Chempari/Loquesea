import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Api/axios';
import './MisCursos.css';

export function MisCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Usar la ruta correcta para obtener cursos del instructor
    api.get('/Dashboard/instructor')
      .then((res) => {
        const cursosData = res.data?.cursos || [];
        setCursos(cursosData);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Error al cargar cursos'))
      .finally(() => setLoading(false));
  }, []);

  const togglePublicado = async (cursoId) => {
    try {
      const res = await api.patch(`/Cursos/${cursoId}/publicar`);
      setCursos((prev) => prev.map((c) => c._id === cursoId ? (res.data?.curso || c) : c));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCurso = async (cursoId) => {
    if (!confirm('Eliminar este curso y todo su contenido?')) return;
    try {
      await api.delete(`/Cursos/${cursoId}`);
      setCursos((prev) => prev.filter((c) => c._id !== cursoId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  if (loading) return <div className="dash-loading">Cargando...</div>;
  if (error) return <div className="dash-error">{error}</div>;

  return (
    <div className="mis-cursos-page">
      <div className="mis-cursos-header">
        <Link to="/cursos/nuevo" className="btn-primary mis-cursos-create-button">Crear curso</Link>
      </div>

      {cursos.length === 0 ? (
        <p className="empty-message">No has creado ningun curso.</p>
      ) : (
        <div className="course-list">
          {cursos.map((curso) => (
            <div key={curso._id} className="course-card course-card-mis-cursos">
              <div className="course-card-header">
                <div>
                  <h3>{curso.titulo}</h3>
                  <p className="course-category">
                    {curso.categoria} · {curso.nivel}
                  </p>
                </div>
                <div className="course-status-group">
                  <button
                    className={`dash-switch ${curso.publicado ? 'on' : ''}`}
                    onClick={() => togglePublicado(curso._id)}
                    title={curso.publicado ? 'Despublicar' : 'Publicar'}
                  />
                  <span className={`dash-stat ${curso.publicado ? 'published' : 'draft'}`}>
                    {curso.publicado ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>
              <div className="course-stats">
                <span className="stat">{curso.total_inscritos ?? 0} inscritos</span>
                <span className="stat">{curso.calificacion_promedio ?? 0} / 5</span>
                <span className="stat">${curso.precio ?? 0}</span>
              </div>
              <div className="course-actions">
                <Link to={`/cursos/${curso._id}/editar`} className="dash-btn-outline">
                  Editar
                </Link>

                  <Link className="delete-btn-outline" onClick={() => deleteCurso(curso._id)}>
                    Eliminar
                  </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}