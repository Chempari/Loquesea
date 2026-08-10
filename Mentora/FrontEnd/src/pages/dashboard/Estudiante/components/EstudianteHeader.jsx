const FilterDropdown = ({ label, value }) => (
  <div className="glass-dropdown">
    <span>{label}: <strong>{value}</strong></span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </div>
);

export function EstudianteHeader() {
  return (
    <div className="header-section">
      <div className="title-block">
        <h1 className="login-title" style={{ marginBottom: '8px', textAlign: 'left' }}>Panel Estudiante</h1>
        <p className="subtitle">Resumen de tu progreso y cursos inscritos.</p>
      </div>
      <div className="filters-group">
        <FilterDropdown label="Categorías" value="Todas" />
        <FilterDropdown label="Nivel" value="Todos" />
        <FilterDropdown label="Precio" value="Todos" />
      </div>
    </div>
  );
}
