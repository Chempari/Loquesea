import { forwardRef } from 'react';

export const Checkbox = forwardRef(function Checkbox({
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
    <div className={`checkbox-wrapper ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={(e) => !disabled && onChange?.(e.target.checked)}
        disabled={disabled}
        className="checkbox-input"
        {...props}
      />
      {label && (
        <label htmlFor={inputId} className="checkbox-label">
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;