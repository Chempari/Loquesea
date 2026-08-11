import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../Api/axios';
import { MisCursoCard } from './components/MisCursoCard';
import './MisCursos.css';

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
            <MisCursoCard
              key={curso._id}
              curso={curso}
              onToggle={togglePublicado}
              onDelete={deleteCurso}
            />
          ))}
        </div>
      )}
    </div>
  );
}
