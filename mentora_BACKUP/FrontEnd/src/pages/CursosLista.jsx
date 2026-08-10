import { useState, useEffect } from 'react';
import './CursosLista.css';
import { Link } from 'react-router-dom';
import api from '../Api/axios';
import { imageUrl } from '../utils';

const CATEGORIAS = ['programacion', 'diseno', 'negocios', 'musica', 'fotografia', 'marketing', 'desarrollo'];
const NIVELES = ['', 'principiante', 'intermedio', 'avanzado'];

export function CursosLista() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ titulo: '', categoria: '', nivel: '' });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadCursos(filters);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  function loadCursos(params) {
    setLoading(true);
    setError('');
    const q = {};
    if (params.titulo) q.titulo = params.titulo;
    if (params.categoria) q.categoria = params.categoria;
    if (params.nivel) q.nivel = params.nivel;

    api.get('/Cursos', { params: q })
      .then((res) => setCursos(res.data.cursos || res.data.data?.cursos || []))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar cursos'))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };
    setFilters(next);
    loadCursos(next);
  };

  return (
    <div className="cursos-page">
      <div className="cursos-filters">
        <input
          name="titulo"
          placeholder="Buscar por titulo..."
          value={filters.titulo}
          onChange={handleChange}
        />
        <select name="categoria" value={filters.categoria} onChange={handleChange}>
          <option value="">Todas las categorias</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select name="nivel" value={filters.nivel} onChange={handleChange}>
          <option value="">Todos los niveles</option>
          {NIVELES.filter(Boolean).map((n) => (
            <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading && <div className="dashboard-loading">Cargando cursos...</div>}
      {error && <div className="dashboard-error">{error}</div>}

      {!loading && !error && (
        <div className="cursos-grid" style={{ marginTop: 24 }}>
          {cursos.length === 0 ? (
            <p className="empty-message">No se encontraron cursos.</p>
          ) : (
            cursos.map((curso) => (
              <Link to={`/cursos/${curso._id}`} key={curso._id} className="curso-card">
                {curso.imagen ? (
                  <img src={imageUrl(curso.imagen)} alt={curso.titulo} className="curso-card-img" />
                ) : (
                  <div className="curso-card-img-placeholder">{'?'}</div>
                )}
                <div className="curso-card-body">
                  <h3>{curso.titulo}</h3>
                  <div className="curso-card-meta">
                    <span>{curso.categoria || 'Sin categoria'}</span>
                    <span>{curso.nivel || 'Sin nivel'}</span>
                  </div>
                  <span className={`curso-card-precio ${curso.precio === 0 ? 'gratis' : ''}`}>
                    {curso.precio === 0 ? 'Gratis' : `$${curso.precio ?? 0}`}
                  </span>
                  {curso.calificacion_promedio > 0 && (
                    <span style={{ fontSize: 13, color: '#f59e0b', display: 'block', marginTop: 4 }}>
                      {'★'} {curso.calificacion_promedio}
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}