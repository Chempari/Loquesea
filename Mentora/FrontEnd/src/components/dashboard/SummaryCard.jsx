export function SummaryCard({
  value,
  label,
  icon,
  variant = 'default',
  trend,
  className = '',
  ...props
}) {
  const variantClasses = {
    default: 'summary-card',
    primary: 'summary-card-primary',
    success: 'summary-card-success',
    warning: 'summary-card-warning',
  };

  const classNames = [
    variantClasses[variant] || variantClasses.default,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {icon && <span className="summary-icon">{icon}</span>}
      <div className="summary-content">
        <span className="summary-value">{value}</span>
        <span className="summary-label">{label}</span>
      </div>
      {trend && (
        <span className={`summary-trend ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '●'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}

export function StatCard({
  value,
  label,
  color = 'default',
  className = '',
  ...props
}) {
  const colorClasses = {
    default: '',
    primary: 'stat-primary',
    success: 'stat-success',
    warning: 'stat-warning',
    error: 'stat-error',
  };

  return (
    <div className={`stat-card ${colorClasses[color]} ${className}`} {...props}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default SummaryCard;