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
    <div className="input-container">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="round-input"
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      <span className="input-icon">{icon}</span>
    </div>
  );
}
