export function StarPicker({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const sizeClasses = {
    sm: 'star-sm',
    md: '',
    lg: 'star-lg',
  };

  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div
      className={`star-rating ${sizeClasses[size] || ''} ${className}`}
      role="radiogroup"
      aria-label="Calificación"
      {...props}
    >
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= value ? 'filled' : ''}`}
          onClick={() => !disabled && onChange?.(star)}
          disabled={disabled}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
          aria-pressed={star <= value}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function StarRating({
  value = 0,
  max = 5,
  size = 'md',
  className = '',
  showValue = false,
  ...props
}) {
  const sizeClasses = {
    sm: 'star-sm',
    md: '',
    lg: 'star-lg',
  };

  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;

  return (
    <div
      className={`star-rating star-rating-readonly ${sizeClasses[size] || ''} ${className}`}
      role="img"
      aria-label={`Calificación: ${value} de ${max}`}
      {...props}
    >
      {stars.map((star) => (
        <span key={star} className="star-icon">
          {star <= fullStars ? '★' : (star === fullStars + 1 && hasHalf ? '½' : '☆')}
        </span>
      ))}
      {showValue && <span className="star-value">{value.toFixed(1)}</span>}
    </div>
  );
}

export default StarPicker;