import { imageUrl } from '../../utils';
import { StarRating, Avatar, Spinner } from '../ui';
import { formatRelativeTime } from '../../utils/formatters';

export function ReviewCard({
  resena,
  className = '',
  ...props
}) {
  const { _id, calificacion, comentario, estudiante_id, createdAt } = resena;

  return (
    <div className={`review-card ${className}`} {...props}>
      <div className="review-header">
        <Avatar
          src={estudiante_id?.foto}
          name={estudiante_id?.nombre}
          size="sm"
        />
        <div className="review-author">
          <span className="review-name">{estudiante_id?.nombre || 'Anónimo'}</span>
          <span className="review-date">{formatRelativeTime(createdAt)}</span>
        </div>
        <StarRating value={calificacion} size="sm" />
      </div>
      {comentario && (
        <p className="review-comment">{comentario}</p>
      )}
    </div>
  );
}

export function ReviewList({
  resenas = [],
  loading = false,
  error,
  emptyMessage = 'No hay reseñas aún.',
  className = '',
  ...props
}) {
  if (loading) {
    return (
      <div className="review-list-loading">
        <Spinner size="md" />
        <p>Cargando reseñas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-list-error" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`review-list ${className}`} {...props}>
      {!resenas.length ? (
        <p className="review-list-empty">{emptyMessage}</p>
      ) : (
        resenas.map((resena) => (
          <ReviewCard key={resena._id} resena={resena} />
        ))
      )}
    </div>
  );
}

export default ReviewCard;