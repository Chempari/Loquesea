import { forwardRef } from 'react';

export const Select = forwardRef(function Select({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  placeholder,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={`input ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${inputId}-helper`} className="form-helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;