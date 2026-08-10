export function Card({
  children,
  className = '',
  variant = 'default',
  hover = false,
  onClick,
  ...props
}) {
  const variantClasses = {
    default: 'card',
    glass: 'glass-card',
    course: 'course-card',
  };

  const classNames = [
    variantClasses[variant] || variantClasses.default,
    hover ? 'card-hover' : '',
    onClick ? 'card-clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={classNames}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;