import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Textarea, Button, StarPicker } from '../ui';

const validationSchema = Yup.object({
  calificacion: Yup.number()
    .min(1, 'Selecciona al menos 1 estrella')
    .required('La calificación es obligatoria'),
  comentario: Yup.string().max(1000, 'Máximo 1000 caracteres'),
});

export function ReviewForm({
  onSubmit,
  initialValues = { calificacion: 0, comentario: '' },
  submitting = false,
  className = '',
  ...props
}) {
  const [hoverStar, setHoverStar] = useState(0);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const handleStarClick = (star) => {
    formik.setFieldValue('calificacion', star);
  };

  const handleStarHover = (star) => {
    setHoverStar(star);
  };

  const handleStarLeave = () => {
    setHoverStar(0);
  };

  return (
    <form onSubmit={formik.handleSubmit} className={`review-form ${className}`} noValidate {...props}>
      <div className="review-form-rating">
        <label className="review-form-label">Tu calificación</label>
        <StarPicker
          value={hoverStar || formik.values.calificacion}
          onChange={handleStarClick}
          onMouseEnter={handleStarHover}
          onMouseLeave={handleStarLeave}
          disabled={submitting}
        />
        {formik.touched.calificacion && formik.errors.calificacion && (
          <span className="form-error">{formik.errors.calificacion}</span>
        )}
      </div>

      <Textarea
        name="comentario"
        label="Tu comentario (opcional)"
        placeholder="Comparte tu experiencia..."
        rows={4}
        value={formik.values.comentario}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.comentario && formik.errors.comentario}
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