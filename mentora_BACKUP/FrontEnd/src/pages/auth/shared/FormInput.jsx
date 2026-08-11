export function FormInput({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  icon,
  autoComplete,
}) {
  return (
    <div className="auth-input-container">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="auth-input"
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      <span className="auth-input-icon">{icon}</span>
    </div>
  );
}
