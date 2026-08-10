export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  ...props
}) {
  const variantClasses = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    glass: 'badge-glass',
  };

  const sizeClasses = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
  };

  const classNames = [
    'badge',
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || '',
    dot ? 'badge-dot' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {dot && <span className="badge-dot-indicator" aria-hidden="true" />}
      {children}
    </span>
  );
}

export default Badge;