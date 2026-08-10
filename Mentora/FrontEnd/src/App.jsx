import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context';
import { AppRoutes } from './router';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}