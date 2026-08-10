import { forwardRef } from 'react';

export const Switch = forwardRef(function Switch({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`switch-wrapper ${className}`}>
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        className={`switch ${checked ? 'on' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label htmlFor={inputId} className="switch-label">
          {label}
        </label>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';
export default Switch;