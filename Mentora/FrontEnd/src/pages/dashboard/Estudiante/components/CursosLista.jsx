import { Link } from 'react-router-dom';
import { ProgressBar } from '../../shared/ProgressBar';

export function CursosLista({ inscripciones }) {
  if (inscripciones.length === 0) {
    return (
      <p style={{ color: 'rgba(232, 240, 236, 0.7)', fontSize: '16px' }}>
        No estás inscrito en ningún curso. <Link to="/explorar" style={{ color: 'var(--verde-intermedio-luz)', textDecoration: 'none', fontWeight: 600 }}>Explora cursos aquí</Link>
      </p>
    );
  }

  return (
    <div className="courses-grid">
      {inscripciones.map((insc) => (
        <Link
          to={`/cursos/${insc.curso_id?._id}/aprender`}
          key={insc._id}
          className="glass-card course-card"
          style={{ textDecoration: 'none' }}
        >
          <div className="card-image-placeholder">IMAGEN CURSO</div>
          <div className="card-info">
            <h3 className="card-title">{insc.curso_id?.titulo || 'Curso sin título'}</h3>
            <p className="card-description">{insc.curso_id?.descripcion || ''}</p>
            <div className="card-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
              <span className="tag-glass">{insc.curso_id?.nivel || 'Sin nivel'}</span>
              <span className="price-glass">{insc.curso_id?.precio ? insc.curso_id.precio : 'Gratis'}</span>
            </div>
            <ProgressBar percentage={insc.porcentaje} label="Progreso" />
          </div>
        </Link>
      ))}
    </div>
  );
}
