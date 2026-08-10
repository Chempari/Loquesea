import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts';
import { CursosLista } from '../pages/web/CursosLista';
import { CursoPreview } from '../pages/web/CursoPreview';

export function PublicRouter() {
  return (
    <PublicLayout title="Explorar cursos">
      <Routes>
        <Route path="/explorar" element={<CursosLista />} />
        <Route path="/cursos/:id" element={<CursoPreview />} />
        <Route path="*" element={<Navigate to="/explorar" replace />} />
      </Routes>
    </PublicLayout>
  );
}