import { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`input ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
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

Textarea.displayName = 'Textarea';
export default Textarea;