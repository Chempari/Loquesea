import { Link } from 'react-router-dom';

export function MisCursoCard({ curso, onToggle, onDelete }) {
  return (
    <div className="course-card course-card-mis-cursos">
      <div className="course-card-header">
        <div>
          <h3>{curso.titulo}</h3>
          <p className="course-category">{curso.categoria} · {curso.nivel}</p>
        </div>
        <div className="course-status-group">
          <button
            className={`dash-switch ${curso.publicado ? 'on' : ''}`}
            onClick={() => onToggle(curso._id)}
            title={curso.publicado ? 'Despublicar' : 'Publicar'}
          />
          <span className={`dash-stat ${curso.publicado ? 'published' : 'draft'}`}>
            {curso.publicado ? 'Publicado' : 'Borrador'}
          </span>
        </div>
      </div>
      <div className="course-stats">
        <span className="dash-stat">{curso.total_inscritos ?? 0} inscritos</span>
        <span className="dash-stat">{curso.calificacion_promedio ?? 0} / 5</span>
        <span className="dash-stat">${curso.precio ?? 0}</span>
      </div>
      <div className="course-actions">
        <Link to={`/cursos/${curso._id}/editar`} className="dash-btn-outline">Editar</Link>
        <Link className="delete-btn-outline" onClick={() => onDelete(curso._id)}>Eliminar</Link>
      </div>
    </div>
  );
}
