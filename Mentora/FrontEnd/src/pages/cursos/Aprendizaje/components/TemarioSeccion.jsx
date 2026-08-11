export function TemarioSeccion({ seccion, abierta, onToggle, onMarcarLeccion, inscripcionId, progresoMap }) {
  return (
    <div className="aprendizaje-seccion">
      <div className="aprendizaje-seccion-header" onClick={onToggle}>
        <span>{seccion.titulo}</span>
        <span>{abierta ? '▲' : '▼'}</span>
      </div>
      {abierta && seccion.lecciones?.map((leccion) => {
        const estaCompletada = progresoMap[leccion._id];
        return (
          <div key={leccion._id} className={`aprendizaje-leccion ${estaCompletada ? 'completada' : ''}`}>
            <label>
              <input
                type="checkbox"
                checked={!!estaCompletada}
                onChange={() => onMarcarLeccion(inscripcionId, leccion._id)}
              />
              <span>{leccion.titulo}</span>
            </label>
            {leccion.url && (
              <a href={leccion.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--accent)' }}>
                Ver video
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
