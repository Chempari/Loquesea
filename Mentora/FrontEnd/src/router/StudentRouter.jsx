import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts';
import { DashboardEstudiante } from '../pages/student/Dashboard';
import { MisCursos } from '../pages/student/MisCursos';
import { CursoAprendizaje } from '../pages/student/CursoAprendizaje';

export function StudentRouter() {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['estudiante']}>
        <DashboardLayout>
          <Routes>
            <Route path="/dashboard" element={<DashboardEstudiante />} />
            <Route path="/mis-cursos" element={<MisCursos />} />
            <Route path="/cursos/:id/aprender" element={<CursoAprendizaje />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DashboardLayout>
      </RoleRoute>
    </ProtectedRoute>
  );
}