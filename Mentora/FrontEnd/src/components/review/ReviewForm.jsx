import { useState } from 'react';
import { Textarea, Button, StarPicker } from '../ui';

export function ReviewForm({
  onSubmit,
  initialValues = { calificacion: 0, comentario: '' },
  submitting = false,
  className = '',
  ...props
}) {
  const [calificacion, setCalificacion] = useState(initialValues.calificacion || 0);
  const [comentario, setComentario] = useState(initialValues.comentario || '');
  const [hoverStar, setHoverStar] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calificacion < 1) {
      setError('Selecciona al menos 1 estrella');
      return;
    }
    setError('');
    await onSubmit({ calificacion, comentario });
  };

  return (
    <form onSubmit={handleSubmit} className={`review-form ${className}`} noValidate {...props}>
      <div className="review-form-rating">
        <label className="review-form-label">Tu calificación</label>
        <StarPicker
          value={hoverStar || calificacion}
          onChange={setCalificacion}
          onMouseEnter={setHoverStar}
          onMouseLeave={() => setHoverStar(0)}
          disabled={submitting}
        />
        {error && <span className="form-error">{error}</span>}
      </div>

      <Textarea
        name="comentario"
        label="Tu comentario (opcional)"
        placeholder="Comparte tu experiencia..."
        rows={4}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        disabled={submitting}
      />

      <div className="review-form-actions">
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
        >
          {submitting ? 'Enviando...' : 'Enviar reseña'}
        </Button>
      </div>
    </form>
  );
}

export default ReviewForm;