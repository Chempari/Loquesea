export function Spinner({
  size = 'md',
  className = '',
  color = 'primary',
  ...props
}) {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: '',
    lg: 'spinner-lg',
  };

  const colorClasses = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    brand: 'spinner-brand',
  };

  const classNames = [
    'spinner',
    sizeClasses[size] || '',
    colorClasses[color] || '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      role="status"
      aria-label="Cargando"
      {...props}
    >
      <span className="spinner-visually-hidden">Cargando...</span>
    </div>
  );
}

export function LoadingOverlay({
  isVisible,
  message = 'Cargando...',
  className = '',
}) {
  if (!isVisible) return null;

  return (
    <div className={`loading-overlay ${className}`} role="status" aria-live="polite">
      <Spinner size="lg" />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default Spinner;