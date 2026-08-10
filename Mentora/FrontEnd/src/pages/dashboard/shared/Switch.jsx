export function Switch({ isOn, onToggle, title }) {
  return (
    <button
      className={`switch ${isOn ? 'on' : ''}`}
      onClick={onToggle}
      title={title}
    />
  );
}
