import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts';
import { Dashboard as DashboardInstructor, MisCursos, CursoForm } from '../pages/instructor';

export function InstructorRouter() {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['instructor']}>
        <DashboardLayout>
          <Routes>
            <Route path="/dashboard" element={<DashboardInstructor />} />
            <Route path="/mis-cursos" element={<MisCursos />} />
            <Route path="/cursos/nuevo" element={<CursoForm />} />
            <Route path="/cursos/:id/editar" element={<CursoForm />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DashboardLayout>
      </RoleRoute>
    </ProtectedRoute>
  );
}