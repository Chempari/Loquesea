import { Link } from 'react-router-dom';
import { imageUrl } from '../../utils';
import { formatPrice } from '../../utils/formatters';
import { Badge, ProgressBar } from '../ui';
import { Card } from '../ui';

export function CourseCard({
  curso,
  variant = 'default',
  onClick,
  ...props
}) {
  const { _id, titulo, descripcion, categoria, nivel, precio, imagen, calificacion_promedio, instructorID } = curso;

  const handleClick = (e) => {
    if (onClick) {
      onClick(e, curso);
    }
  };

  const CardComponent = variant === 'link' ? Link : 'div';

  return (
    <CardComponent
      className={`course-card ${variant}`}
      to={variant === 'link' ? `/cursos/${_id}` : undefined}
      onClick={handleClick}
      {...props}
    >
      {imagen ? (
        <img
          src={imageUrl(imagen)}
          alt={titulo}
          className="course-card-img"
        />
      ) : (
        <div className="course-card-img-placeholder">📚</div>
      )}
      <div className="course-card-body">
        <h3 className="course-card-title">{titulo}</h3>
        <div className="course-card-meta">
          {categoria && <Badge variant="glass" size="sm">{categoria}</Badge>}
          {nivel && <Badge variant="glass" size="sm">{nivel}</Badge>}
        </div>
        <div className="course-card-footer">
          <span className={`course-card-price ${precio === 0 ? 'gratis' : ''}`}>
            {formatPrice(precio)}
          </span>
          {calificacion_promedio > 0 && (
            <span className="course-card-rating">
              ★ {calificacion_promedio}
            </span>
          )}
        </div>
      </div>
    </CardComponent>
  );
}

export function InstructorCourseCard({
  curso,
  onTogglePublish,
  onEdit,
  onDelete,
  ...props
}) {
  const { _id, titulo, categoria, nivel, precio, publicado, total_inscritos, calificacion_promedio } = curso;

  return (
    <Card variant="default" className="instructor-course-card" {...props}>
      <div className="course-card-header">
        <div>
          <h3>{titulo}</h3>
          <p className="course-category">{categoria} · {nivel}</p>
        </div>
        <div className="course-status-group">
          <Switch
            checked={publicado}
            onChange={onTogglePublish}
            label={publicado ? 'Publicado' : 'Borrador'}
          />
          <Badge variant={publicado ? 'success' : 'warning'} size="sm">
            {publicado ? 'Publicado' : 'Borrador'}
          </Badge>
        </div>
      </div>
      <div className="course-stats">
        <span>👥 {total_inscritos ?? 0} inscritos</span>
        <span>⭐ {calificacion_promedio ?? 0} / 5</span>
        <span>💰 {formatPrice(precio)}</span>
      </div>
      <div className="course-actions">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onEdit?.(_id)}
        >
          Editar
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete?.(_id)}
        >
          Eliminar
        </button>
      </div>
    </Card>
  );
}

export function StudentCourseCard({
  curso,
  progreso = 0,
  onLearn,
  ...props
}) {
  const { _id, titulo, descripcion, categoria, nivel, precio, imagen, instructorID } = curso;

  return (
    <Card variant="default" className="student-course-card" {...props}>
      {imagen && (
        <img src={imageUrl(imagen)} alt={titulo} className="course-card-img" />
      )}
      <div className="course-card-body">
        <h3 className="course-card-title">{titulo}</h3>
        <p className="course-card-description">{descripcion}</p>
        <div className="course-card-meta">
          {categoria && <Badge variant="glass" size="sm">{categoria}</Badge>}
          {nivel && <Badge variant="glass" size="sm">{nivel}</Badge>}
        </div>
        <ProgressBar
          value={progreso}
          max={100}
          showLabel
          label={`${progreso}% completado`}
          size="md"
        />
        {onLearn && (
          <button
            type="button"
            className="btn btn-primary btn-full mt-4"
            onClick={() => onLearn(_id)}
          >
            Continuar aprendiendo
          </button>
        )}
      </div>
    </Card>
  );
}

export default CourseCard;