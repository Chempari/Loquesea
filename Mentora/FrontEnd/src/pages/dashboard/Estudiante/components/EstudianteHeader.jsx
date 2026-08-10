const FilterDropdown = ({ label, value }) => (
  <div className="estudiante-dropdown">
    <span>{label}: <strong>{value}</strong></span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </div>
);

export function EstudianteHeader() {
  return (
    <div className="estudiante-header">
      <div className="estudiante-title-block">
        <h1 className="estudiante-title" style={{ marginBottom: '8px', textAlign: 'left' }}>Panel Estudiante</h1>
        <p className="estudiante-subtitle">Resumen de tu progreso y cursos inscritos.</p>
      </div>
      <div className="estudiante-filters">
        <FilterDropdown label="Categorías" value="Todas" />
        <FilterDropdown label="Nivel" value="Todos" />
        <FilterDropdown label="Precio" value="Todos" />
      </div>
    </div>
  );
}
