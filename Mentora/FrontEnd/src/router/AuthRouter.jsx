import { Routes, Route, Navigate } from 'react-router-dom';
import { GuestRoute } from './ProtectedRoute';
import { AuthLayout } from '../layouts';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

export function AuthRouter() {
  return (
    <GuestRoute>
      <AuthLayout>
        <Routes>
          <Route
            path="/login"
            element={
              <Login />
            }
          />
          <Route
            path="/register"
            element={
              <Register />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthLayout>
    </GuestRoute>
  );
}