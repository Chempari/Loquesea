import { CATEGORIAS, NIVELES } from '../../constants';
import { Input, Select } from '../ui';

export function CourseFilters({
  filters,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className={`course-filters ${className}`} {...props}>
      <Input
        name="titulo"
        placeholder="Buscar por título..."
        value={filters.titulo || ''}
        onChange={onChange}
        className="filter-input"
      />
      <Select
        name="categoria"
        placeholder="Todas las categorías"
        options={CATEGORIAS.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
        value={filters.categoria || ''}
        onChange={onChange}
        className="filter-select"
      />
      <Select
        name="nivel"
        placeholder="Todos los niveles"
        options={NIVELES.map((n) => ({ value: n, label: n.charAt(0).toUpperCase() + n.slice(1) }))}
        value={filters.nivel || ''}
        onChange={onChange}
        className="filter-select"
      />
    </div>
  );
}

export default CourseFilters;