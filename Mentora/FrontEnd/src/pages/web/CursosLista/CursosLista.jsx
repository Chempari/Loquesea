import { useEffect } from 'react';
import { useCourses } from '../../../hooks';
import { CourseFilters } from '../../../components/course/CourseFilters';
import { CourseGrid } from '../../../components/course/CourseGrid';
import { Spinner } from '../../../components/ui';

export function CursosLista() {
  const { cursos, loading, error, filters, loadCursos, updateFilters } = useCourses();

  useEffect(() => {
    loadCursos(filters);
  }, []);

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
    loadCursos({ ...filters, ...newFilters });
  };

  return (
    <div className="cursos-page">
      <header className="cursos-header">
        <h1>Explorar cursos</h1>
        <CourseFilters filters={filters} onChange={handleFilterChange} />
      </header>

      <CourseGrid
        cursos={cursos}
        loading={loading}
        error={error}
        emptyMessage="No se encontraron cursos con los filtros actuales."
      />
    </div>
  );
}

export default CursosLista;