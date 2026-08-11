import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../Api/axios';
import { imageUrl } from '../../../utils';
import { CursoCard } from './components/CursoCard';
import './CursosLista.css';

const CATEGORIAS = ['programacion', 'diseno', 'negocios', 'musica', 'fotografia', 'marketing', 'desarrollo'];
const NIVELES = ['', 'principiante', 'intermedio', 'avanzado'];

export function CursosLista() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ titulo: '', categoria: '', nivel: '' });

  useEffect(() => {
    loadCursos(filters);
  }, []);

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
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };
    setFilters(next);
    loadCursos(next);
  };

  return (
    <div className="lista-page">
      <div className="lista-filters">
        <input name="titulo" placeholder="Buscar por titulo..." value={filters.titulo} onChange={handleChange} />
        <select name="categoria" value={filters.categoria} onChange={handleChange}>
          <option value="">Todas las categorias</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select name="nivel" value={filters.nivel} onChange={handleChange}>
          <option value="">Todos los niveles</option>
          {NIVELES.filter(Boolean).map((n) => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
        </select>
      </div>

      {loading && <div className="dash-loading">Cargando cursos...</div>}
      {error && <div className="dash-error">{error}</div>}

      {!loading && !error && (
        <div className="lista-grid" style={{ marginTop: 24 }}>
          {cursos.length === 0 ? (
            <p className="lista-empty-message">No se encontraron cursos.</p>
          ) : (
            cursos.map((curso) => <CursoCard key={curso._id} curso={curso} />)
          )}
        </div>
      )}
    </div>
  );
}
