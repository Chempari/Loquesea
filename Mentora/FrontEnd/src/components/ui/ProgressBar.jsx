export function ProgressBar({
  value = 0,
  max = 100,
  className = '',
  variant = 'default',
  showLabel = false,
  label,
  size = 'md',
  animated = true,
  ...props
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const sizeClasses = {
    sm: 'progress-sm',
    md: '',
    lg: 'progress-lg',
  };

  const variantClasses = {
    default: '',
    success: 'progress-success',
    warning: 'progress-warning',
    error: 'progress-error',
  };

  const classNames = [
    'progress-bar',
    sizeClasses[size] || '',
    variantClasses[variant] || '',
    animated ? 'progress-animated' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} {...props}>
      <div
        className="progress-fill"
        style={{ width: `${percentage}%` }}
      />
      {(showLabel || label) && (
        <span className="progress-label">
          {label ?? `${Math.round(percentage)}%`}
        </span>
      )}
    </div>
  );
}

export default ProgressBar;