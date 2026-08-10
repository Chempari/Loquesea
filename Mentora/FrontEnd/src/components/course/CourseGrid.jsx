import { CourseCard } from './CourseCard';
import { Spinner } from '../ui';

export function CourseGrid({
  cursos = [],
  loading = false,
  error,
  emptyMessage = 'No se encontraron cursos.',
  variant = 'default',
  onCardClick,
  ...props
}) {
  if (loading) {
    return (
      <div className="course-grid-loading" role="status" aria-live="polite">
        <Spinner size="lg" />
        <p>Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-grid-error" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!cursos.length) {
    return (
      <div className="course-grid-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`course-grid ${variant}`} {...props}>
      {cursos.map((curso) => (
        <CourseCard
          key={curso._id}
          curso={curso}
          variant="link"
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}

export default CourseGrid;