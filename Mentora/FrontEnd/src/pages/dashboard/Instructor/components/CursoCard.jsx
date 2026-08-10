import { Link } from 'react-router-dom';
import { Switch } from '../../shared/Switch';

export function CursoCard({ curso, onTogglePublicado }) {
  return (
    <div className="course-card">
      <div className="course-info">
        <h3>{curso.titulo}</h3>
        <div className="switch-wrapper">
          <Switch
            isOn={curso.publicado}
            onToggle={() => onTogglePublicado(curso)}
            title={curso.publicado ? 'Despublicar' : 'Publicar'}
          />
          <span className={`stat ${curso.publicado ? 'published' : 'draft'}`}>
            {curso.publicado ? 'Publicado' : 'Borrador'}
          </span>
        </div>
      </div>
      <span className="course-category">{curso.categoria} - {curso.nivel}</span>
      <div className="course-stats">
        <span className="stat">{curso.total_inscritos ?? 0} inscritos</span>
        <span className="stat">{curso.calificacion_promedio ?? 0} / 5</span>
        <span className="stat">${curso.precio ?? 0}</span>
      </div>
      <Link to={`/cursos/${curso._id}/editar`} className="btn-outline">
        Editar
      </Link>
    </div>
  );
}
