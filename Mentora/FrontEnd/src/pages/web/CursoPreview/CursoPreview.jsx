import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { useCourses, useEnrollment, useReviews } from '../../../hooks';
import { imageUrl } from '../../../utils';
import { formatPrice } from '../../../utils/formatters';
import { Button, Badge, StarRating, StarPicker } from '../../../components/ui';
import { ReviewList, ReviewForm } from '../../../components/review';
import { Card } from '../../../components/ui';
import './CursoPreview.css';

const StarPickerInline = ({ value, onChange }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        className={s <= value ? 'filled' : ''}
        onClick={() => onChange(s)}
      >
        ★
      </button>
    ))}
  </div>
);

export function CursoPreview() {
  const { id } = useParams();
  const { user } = useAuth();
  const { curso, loading: cursoLoading, error: cursoError } = useCourses(id);
  const { enrolled, checking, enrolling, message, error: enrollError, enroll } = useEnrollment(id);
  const { resenas, loading: resenasLoading, error: resenasError, load: loadResenas } = useReviews(id);
  const [seccionAbierta, setSeccionAbierta] = useState(0);
  const [nuevaCalif, setNuevaCalif] = useState(0);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [resenaMsg, setResenaMsg] = useState('');

  const handleEnviarResena = async () => {
    if (nuevaCalif < 1) return;
    setEnviandoResena(true);
    setResenaMsg('');
    try {
      await fetch(`/api/v1/Resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curso_id: id, calificacion: nuevaCalif, comentario: nuevoComentario }),
      });
      setResenaMsg('Reseña enviada.');
      setNuevaCalif(0);
      setNuevoComentario('');
      loadResenas();
      // Recargar curso para actualizar calificación promedio
      window.location.reload();
    } catch (err) {
      setResenaMsg(err.message || 'Error al enviar reseña');
    } finally {
      setEnviandoResena(false);
    }
  };

  const handleInscribir = async () => {
    enroll();
  };

  if (cursoLoading) return <div className="dashboard-loading">Cargando curso...</div>;
  if (cursoError) return <div className="dashboard-error">{cursoError}</div>;
  if (!curso) return <div className="dashboard-error">Curso no encontrado</div>;

  return (
    <div className="curso-preview-page">
      <div className="curso-preview">
        <div className="curso-preview-header">
          <h1>{curso.titulo}</h1>
          <div className="curso-preview-meta">
            <Badge variant="glass">{curso.categoria}</Badge>
            <Badge variant="glass">{curso.nivel}</Badge>
            {curso.calificacion_promedio > 0 && (
              <Badge variant="warning">★ {curso.calificacion_promedio}</Badge>
            )}
          </div>
        </div>

        <div className="curso-preview-body">
          <div className="curso-preview-info">
            <div className="curso-preview-desc">
              <h2>Descripción</h2>
              <p>{curso.descripcion || 'Sin descripción.'}</p>
            </div>

            {curso.secciones && curso.secciones.length > 0 && (
              <div className="temario">
                <h2>Temario</h2>
                {curso.secciones.map((seccion, i) => (
                  <div key={seccion._id} className="seccion-item">
                    <div className="seccion-header" onClick={() => setSeccionAbierta(seccionAbierta === i ? -1 : i)}>
                      <span>Sección {i + 1}: {seccion.titulo}</span>
                      <span>{seccionAbierta === i ? '▲' : '▼'}</span>
                    </div>
                    {seccionAbierta === i && seccion.lecciones && seccion.lecciones.map((leccion) => (
                      <div key={leccion._id} className="leccion-item">
                        <span className="leccion-icon">▶</span>
                        <span>{leccion.titulo}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div className="resenas-section">
              <h2>Reseñas ({resenas.length})</h2>
              {curso.calificacion_promedio > 0 && (
                <div className="calificacion-display">
                  <StarRating value={curso.calificacion_promedio} size="lg" showValue />
                </div>
              )}

              <ReviewList
                resenas={resenas}
                loading={resenasLoading}
                error={resenasError}
              />

              {user?.rol === 'estudiante' && enrolled && (
                <ReviewForm
                  onSubmit={handleEnviarResena}
                  initialValues={{ calificacion: 0, comentario: '' }}
                  submitting={enviandoResena}
                />
              )}
            </div>
          </div>

          <div className="curso-preview-sidebar">
            <div className={`curso-preview-price ${curso.precio === 0 ? 'gratis' : ''}`}>
              {formatPrice(curso.precio)}
            </div>
            {curso.instructorID && (
              <div className="curso-preview-instructor">
                <img src={imageUrl(curso.instructorID.foto)} alt="Instructor" />
                <span>{curso.instructorID?.nombre || 'Sin nombre'}</span>
              </div>
            )}

            {user?.rol === 'estudiante' && !enrolled && (
              <Button
                className="btn-inscribir"
                onClick={handleInscribir}
                disabled={enrolling}
              >
                {enrolling ? 'Inscribiendo...' : 'Inscribirse'}
              </Button>
            )}
            {enrolled && (
              <Link to={`/cursos/${id}/aprender`} className="btn-inscribir" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Ir al curso
              </Link>
            )}
            {message && <div style={{ marginTop: 12, fontSize: 14, color: '#059669' }}>{message}</div>}
            {enrollError && <div style={{ marginTop: 12, fontSize: 14, color: '#ef4444' }}>{enrollError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CursoPreview;