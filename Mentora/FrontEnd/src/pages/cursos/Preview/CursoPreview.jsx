import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import api from '../../../Api/axios';
import { StarPicker, ResenaCard } from './components';
import { imageUrl } from '../../../utils';
import './CursoPreview.css';

export function CursoPreview() {
  const { id } = useParams();
  const { user } = useAuth();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [seccionAbierta, setSeccionAbierta] = useState(0);
  const [resenas, setResenas] = useState([]);
  const [resenasLoading, setResenasLoading] = useState(true);
  const [nuevaCalif, setNuevaCalif] = useState(0);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [resenaMsg, setResenaMsg] = useState('');

  useEffect(() => {
    api.get(`/Cursos/${id}`)
      .then((res) => setCurso(res.data?.curso || res.data?.data?.curso))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar curso'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !curso || user.rol !== 'estudiante') return;
    api.get('/Inscripciones/mis-cursos')
      .then((res) => {
        const inscripciones = res.data?.inscripciones || [];
        setEnrolled(inscripciones.some(insc => insc.curso_id?._id === id));
      })
      .catch(console.error);
  }, [id, user, curso]);

  useEffect(() => {
    api.get(`/Cursos/${id}/resenas`)
      .then((res) => setResenas(res.data.resenas || []))
      .catch(() => {})
      .finally(() => setResenasLoading(false));
  }, [id]);

  const handleEnviarResena = async () => {
    if (nuevaCalif < 1) return;
    setEnviandoResena(true);
    setResenaMsg('');
    try {
      await api.post('/Resenas', { curso_id: id, calificacion: nuevaCalif, comentario: nuevoComentario });
      setResenaMsg('Resena enviada.');
      setNuevaCalif(0);
      setNuevoComentario('');
      const res = await api.get(`/Cursos/${id}/resenas`);
      setResenas(res.data.resenas || []);
    } catch (err) {
      setResenaMsg(err.response?.data?.message || 'Error al enviar resena');
    } finally {
      setEnviandoResena(false);
    }
  };

  const handleInscribir = async () => {
    setEnrolling(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/Inscripciones', { curso_id: id });
      if (res.data.requiere_pago) {
        setMessage('Redirigiendo al pago...');
        await api.post('/Inscripciones/pagar', { curso_id: id });
        setEnrolled(true);
        setMessage('Inscripcion exitosa!');
      } else {
        setEnrolled(true);
        setMessage('Inscripcion exitosa!');
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('Ya estas inscrito')) {
        setEnrolled(true);
        setMessage('Ya estas inscrito.');
      } else {
        setError(err.response?.data?.message || 'Error al inscribirse');
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="dash-loading">Cargando curso...</div>;
  if (error) return <div className="dash-error">{error}</div>;
  if (!curso) return <div className="dash-error">Curso no encontrado</div>;

  return (
    <div>
      <div className="curso-preview">
        <div className="curso-preview-header">
          <h1>{curso.titulo}</h1>
          <div className="curso-preview-meta">
            <span>{curso.categoria}</span>
            <span>{curso.nivel}</span>
            {curso.calificacion_promedio > 0 && <span style={{ color: '#f59e0b' }}>{'★'} {curso.calificacion_promedio}</span>}
          </div>
        </div>
        <div className="curso-preview-body">
          <div className="curso-preview-info">
            <div className="curso-preview-desc">
              <h2>Descripcion</h2>
              <p>{curso.descripcion || 'Sin descripcion.'}</p>
            </div>
            <div className="curso-preview-sidebar">
              <div className={`curso-preview-price ${curso.precio === 0 ? 'gratis' : ''}`}>
                {curso.precio === 0 ? 'Gratis' : `$${curso.precio ?? 0}`}
              </div>
              {curso.instructorID && (
                <div className="curso-preview-instructor">
                  {curso.instructorID.foto ? (
                    <img src={imageUrl(curso.instructorID.foto)} alt="Instructor" />
                  ) : (
                    <div className="perfil-photo-placeholder" style={{ width: 40, height: 40, fontSize: 18 }}>
                      {curso.instructorID?.nombre?.charAt(0) || '?'}
                    </div>
                  )}
                  <span>{curso.instructorID?.nombre || 'Sin nombre'}</span>
                </div>
              )}
              {user?.rol === 'estudiante' && !enrolled && (
                <button className="preview-btn-inscribir" onClick={handleInscribir} disabled={enrolling}>
                  {enrolling ? 'Inscribiendo...' : 'Inscribirse'}
                </button>
              )}
              {enrolled && (
                <Link to={`/cursos/${id}/aprender`} className="preview-btn-inscribir" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                  Ir al curso
                </Link>
              )}
              {message && <div style={{ marginTop: 12, fontSize: 14, color: '#059669' }}>{message}</div>}
              {error && <div style={{ marginTop: 12, fontSize: 14, color: '#ef4444' }}>{error}</div>}
            </div>
          </div>
        </div>
      </div>

      {curso.secciones?.length > 0 && (
        <div className="preview-temario">
          <h2>Temario</h2>
          {curso.secciones.map((seccion, i) => (
            <div key={seccion._id} className="seccion-item">
              <div className="preview-seccion-header" onClick={() => setSeccionAbierta(seccionAbierta === i ? -1 : i)}>
                <span>Seccion {i + 1}: {seccion.titulo}</span>
                <span>{seccionAbierta === i ? '▲' : '▼'}</span>
              </div>
              {seccionAbierta === i && seccion.lecciones?.map((leccion) => (
                <div key={leccion._id} className="preview-leccion-item">
                  <span className="leccion-icon">{'▶'}</span>
                  <span>{leccion.titulo}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="resenas-section">
        <h2>Resenas ({resenas.length})</h2>
        {curso.calificacion_promedio > 0 && (
          <div className="calificacion-display">
            <span className="estrellas">{'\u2605'}</span>
            <span>{curso.calificacion_promedio}</span>
          </div>
        )}
        {resenasLoading ? (
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>Cargando resenas...</p>
        ) : resenas.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>No hay resenas aun.</p>
        ) : (
          resenas.map((r) => <ResenaCard key={r._id} resena={r} />)
        )}

        {user?.rol === 'estudiante' && enrolled && (
          <div className="resena-form">
            <h3>Deja tu resena</h3>
            <StarPicker value={nuevaCalif} onChange={setNuevaCalif} />
            <div className="preview-form-group">
              <textarea rows={3} placeholder="Escribe tu comentario..." value={nuevoComentario} onChange={(e) => setNuevoComentario(e.target.value)} />
            </div>
            <button className="preview-btn-enviar" onClick={handleEnviarResena} disabled={enviandoResena || nuevaCalif < 1}>
              {enviandoResena ? 'Enviando...' : 'Enviar resena'}
            </button>
            {resenaMsg && <p style={{ marginTop: 8, fontSize: 13, color: resenaMsg.includes('Error') ? 'var(--error)' : '#059669' }}>{resenaMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

