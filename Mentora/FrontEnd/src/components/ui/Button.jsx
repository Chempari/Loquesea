export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = size !== 'md' ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'btn-full' : '';
  const disabledClass = (disabled || loading) ? 'btn-disabled' : '';

  const classNames = [baseClasses, variantClasses, sizeClasses, widthClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default Button;