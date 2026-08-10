import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { enrollmentService } from '../../../services';
import { ProgressBar } from '../../../components/ui';
import { Spinner } from '../../../components/ui';

export function CursoAprendizaje() {
  const { id } = useParams();
  const { user } = useAuth();
  const [curso, setCurso] = useState(null);
  const [inscripcion, setInscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seccionAbierta, setSeccionAbierta] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/Cursos/${id}`).then(r => r.json()),
      enrollmentService.getMyCourses()
    ])
      .then(([cRes, iRes]) => {
        setCurso(cRes.data?.curso || cRes.data?.data?.curso);
        const inscs = iRes.data?.inscripciones || [];
        const miInsc = inscs.find((i) => i.curso_id?._id === id || i.curso_id === id);
        if (miInsc) setInscripcion(miInsc);
        else setError('No estás inscrito en este curso.');
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [id]);

  const marcarLeccion = async (inscripcionId, leccionId) => {
    try {
      const res = await enrollmentService.markLessonComplete(inscripcionId, leccionId);
      const updated = res.data?.inscripcion;
      setInscripcion((prev) => ({
        ...prev,
        progreso: updated.progreso,
        porcentaje: updated.porcentaje
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="dashboard-loading">Cargando curso...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;
  if (!curso) return <div className="dashboard-error">Curso no encontrado</div>;

  const progresoMap = {};
  if (inscripcion?.progreso) {
    inscripcion.progreso.forEach((p) => {
      progresoMap[p.leccion_id?._id || p.leccion_id] = p.completada;
    });
  }

  const totalLecciones = curso.secciones?.reduce((sum, s) => sum + (s.lecciones?.length || 0), 0) || 0;
  const completadas = Object.values(progresoMap).filter(Boolean).length;

  return (
    <div className="curso-aprendizaje-page">
      <div className="curso-aprendizaje-header">
        <h1>{curso.titulo}</h1>
        <div className="curso-aprendizaje-meta">
          <div className="curso-aprendizaje-progress">
            <ProgressBar
              value={inscripcion?.porcentaje || 0}
              max={100}
              showLabel
              label={`${inscripcion?.porcentaje || 0}%`}
              size="lg"
            />
            <span>{completadas}/{totalLecciones} lecciones</span>
          </div>
        </div>
      </div>

      {curso.secciones && curso.secciones.length > 0 ? (
        <div className="temario">
          {curso.secciones.map((seccion, i) => (
            <div key={seccion._id} className="seccion-item">
              <div className="seccion-header" onClick={() => setSeccionAbierta(seccionAbierta === i ? -1 : i)}>
                <span>{seccion.titulo}</span>
                <span>{seccionAbierta === i ? '▲' : '▼'}</span>
              </div>
              {seccionAbierta === i && seccion.lecciones && seccion.lecciones.map((leccion) => {
                const estaCompletada = progresoMap[leccion._id];
                return (
                  <div key={leccion._id} className={`leccion-item ${estaCompletada ? 'completada' : ''}`}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!estaCompletada}
                        onChange={() => marcarLeccion(inscripcion._id, leccion._id)}
                      />
                      <span>{leccion.titulo}</span>
                    </label>
                    {leccion.url && (
                      <a href={leccion.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-primary)' }}>
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
        <p className="empty-message">Este curso no tiene contenido aún.</p>
      )}
    </div>
  );
}

export default CursoAprendizaje;