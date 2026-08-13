import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../../Api/axios';
import { imageUrl } from '../../../utils';
import './PerfilPublico.css';

export function PerfilPublico() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/Instructores/${id}`),
      api.get('/Cursos', { params: { instructorID: id } }),
    ])
      .then(([iRes, cRes]) => {
        setInstructor(iRes.data.instructor);
        setCursos(cRes.data.cursos || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar perfil'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="dash-loading">Cargando perfil...</div>;
  if (error) return <div className="dash-error">{error}</div>;
  if (!instructor) return <div className="dash-error">Instructor no encontrado</div>;

  return (
    <div className="perfil-publico-page">
      <div className="perfil-publico-card">
        <div className="perfil-publico-header">
          {instructor.foto ? (
            <img src={imageUrl(instructor.foto)} alt={instructor.nombre} className="perfil-publico-foto" />
          ) : (
            <div className="perfil-publico-placeholder">
              {instructor.nombre?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
          <div className="perfil-publico-nombre">
            <h1>{instructor.nombre} {instructor.apellido || ''}</h1>
            <span className="perfil-publico-rol">Instructor</span>
          </div>
        </div>
        {instructor.biografia && <p className="perfil-publico-bio">{instructor.biografia}</p>}
        {instructor.redes_sociales?.length > 0 && (
          <div className="perfil-publico-redes">
            {instructor.redes_sociales.map((red, i) => (
              <a key={i} href={red} target="_blank" rel="noopener noreferrer">
                {red}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="perfil-publico-cursos">
        <h2>Sus cursos ({cursos.length})</h2>
        {cursos.length === 0 ? (
          <p className="perfil-publico-empty">Este instructor no tiene cursos publicados.</p>
        ) : (
          <div className="perfil-publico-lista">
            {cursos.map((curso) => (
              <Link key={curso._id} to={`/cursos/${curso._id}`} className="perfil-publico-curso">
                {curso.imagen ? (
                  <img src={imageUrl(curso.imagen)} alt="" />
                ) : (
                  <div className="perfil-publico-curso-placeholder">{'▶'}</div>
                )}
                <div className="perfil-publico-curso-info">
                  <h3>{curso.titulo}</h3>
                  <span>{curso.categoria || 'Sin categoria'} · {curso.nivel || ''}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}