import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Api/axios';
import './CursoAprendizaje.css';

export function CursoAprendizaje() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [inscripcion, setInscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seccionAbierta, setSeccionAbierta] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/Cursos/${id}`),
      api.get('/Inscripciones/mis-cursos')
    ])
      .then(([cRes, iRes]) => {
        setCurso(cRes.data.curso || cRes.data.data?.curso);
        const inscs = iRes.data.inscripciones || [];
        const miInsc = inscs.find((i) => i.curso_id?._id === id || i.curso_id === id);
        if (miInsc) setInscripcion(miInsc);
        else setError('No estas inscrito en este curso.');
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [id]);

  const marcarLeccion = async (inscripcionId, leccionId) => {
    try {
      const res = await api.patch(`/Inscripciones/${inscripcionId}/lecciones/${leccionId}`);
      const updated = res.data.inscripcion;
      setInscripcion((prev) => ({
        ...prev,
        progreso: updated.progreso,
        porcentaje: updated.porcentaje
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="dash-loading">Cargando curso...</div>;
  if (error) return <div className="dash-error">{error}</div>;
  if (!curso) return <div className="dash-error">Curso no encontrado</div>;

  const progresoMap = {};
  if (inscripcion?.progreso) {
    inscripcion.progreso.forEach((p) => {
      progresoMap[p.leccion_id?._id || p.leccion_id] = p.completada;
    });
  }

  const totalLecciones = curso.secciones?.reduce((sum, s) => sum + (s.lecciones?.length || 0), 0) || 0;
  const completadas = Object.values(progresoMap).filter(Boolean).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{curso.titulo}</h1>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="progress-bar" style={{ flex: 1, height: 10 }}>
            <div className="progress-fill" style={{ width: `${inscripcion?.porcentaje || 0}%` }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{inscripcion?.porcentaje || 0}%</span>
          <span style={{ fontSize: 13, color: 'var(--text-light)' }}>{completadas}/{totalLecciones} lecciones</span>
        </div>
      </div>

      {curso.secciones && curso.secciones.length > 0 ? (
        <div className="aprendizaje-temario" style={{ marginTop: 0 }}>
          {curso.secciones.map((seccion, i) => (
            <div key={seccion._id} className="aprendizaje-seccion">
              <div className="aprendizaje-seccion-header" onClick={() => setSeccionAbierta(seccionAbierta === i ? -1 : i)}>
                <span>{seccion.titulo}</span>
                <span>{seccionAbierta === i ? '▲' : '▼'}</span>
              </div>
              {seccionAbierta === i && seccion.lecciones && seccion.lecciones.map((leccion) => {
                const estaCompletada = progresoMap[leccion._id];
                return (
                  <div key={leccion._id} className={`aprendizaje-leccion ${estaCompletada ? 'completada' : ''}`}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!estaCompletada}
                        onChange={() => marcarLeccion(inscripcion._id, leccion._id)}
                      />
                      <span>{leccion.titulo}</span>
                    </label>
                    {leccion.url && (
                      <a href={leccion.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--accent)' }}>
                        Ver video
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <p className="aprendizaje-empty-message">Este curso no tiene contenido aun.</p>
      )}
    </div>
  );
}