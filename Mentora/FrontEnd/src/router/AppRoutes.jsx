import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthRouter } from './AuthRouter';
import { PublicRouter } from './PublicRouter';
import { StudentRouter } from './StudentRouter';
import { InstructorRouter } from './InstructorRouter';
import { Perfil } from '../pages/profile';

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.rol === 'instructor') {
    return <InstructorRouter />;
  }

  return <StudentRouter />;
}

export function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        <div className="spinner spinner-lg" />
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthRouter />} />
      <Route path="/register" element={<AuthRouter />} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/explorar" element={<PublicRouter />} />
      <Route path="/cursos/:id" element={<PublicRouter />} />
      <Route path="/dashboard" element={<DashboardRouter />} />
      <Route path="/mis-cursos" element={<DashboardRouter />} />
      <Route path="/cursos/nuevo" element={<DashboardRouter />} />
      <Route path="/cursos/:id/editar" element={<DashboardRouter />} />
      <Route path="/cursos/:id/aprender" element={<DashboardRouter />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}