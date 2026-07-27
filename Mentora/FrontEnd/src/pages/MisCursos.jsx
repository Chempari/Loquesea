import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Api/axios';

export function MisCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/Dashboard/instructor')
      .then((res) => setCursos(res.data?.cursos || []))
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

  if (loading) return <div className="dashboard-loading">Cargando...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Link to="/cursos/nuevo" className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>Crear curso</Link>
      </div>

      {cursos.length === 0 ? (
        <p className="empty-message">No has creado ningun curso.</p>
      ) : (
        <div className="course-list">
          {cursos.map((curso) => (
            <div key={curso._id} className="course-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>{curso.titulo}</h3>
                <div className="switch-wrapper">
                  <button
                    className={`switch ${curso.publicado ? 'on' : ''}`}
                    onClick={() => togglePublicado(curso._id)}
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
              <div className="course-stats" style={{ marginBottom: 12 }}>
                <span className="stat">{curso.total_inscritos ?? 0} inscritos</span>
                <span className="stat">{curso.calificacion_promedio ?? 0} / 5</span>
                <span className="stat">${curso.precio ?? 0}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/cursos/${curso._id}/editar`} className="btn-outline" style={{ display: 'inline-block', textDecoration: 'none', fontSize: 13 }}>
                  Editar
                </Link>
                <button className="btn-sm danger" type="button" onClick={() => deleteCurso(curso._id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}