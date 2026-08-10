import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Button } from '../ui';

export function Navbar({ variant = 'dashboard' }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname.startsWith(path);

  if (variant === 'public') {
    return (
      <nav className="navbar navbar-public" role="navigation" aria-label="Navegación principal">
        <Link to="/" className="navbar-brand" aria-label="Mentora - Inicio">
          MENTORA
        </Link>
        <div className="navbar-links">
          <Link
            to="/explorar"
            className={`navbar-link ${isActive('/explorar') ? 'active' : ''}`}
          >
            Explorar cursos
          </Link>
          <Link
            to="/login"
            className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className={`navbar-link ${isActive('/register') ? 'active' : ''}`}
          >
            Registrarse
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-dashboard glass-navbar" role="navigation" aria-label="Panel de control">
      <Link to="/dashboard" className="navbar-brand" aria-label="Dashboard">
        MENTORA
      </Link>

      <div className="navbar-search">
        <label htmlFor="global-search" className="visually-hidden">Buscar cursos</label>
        <input
          id="global-search"
          type="search"
          placeholder="Buscar cursos..."
          className="round-input search-input"
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="visually-hidden">Escribe para buscar cursos</span>
      </div>

      <div className="navbar-actions">
        <Link
          to="/explorar"
          className={`navbar-btn ${isActive('/explorar') ? 'active' : ''}`}
        >
          Explorar
        </Link>
        <Link
          to="/dashboard"
          className={`navbar-btn ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Dashboard
        </Link>

        {user?.rol === 'instructor' && (
          <>
            <Link
              to="/cursos/nuevo"
              className={`navbar-btn ${isActive('/cursos/nuevo') ? 'active' : ''}`}
            >
              Crear curso
            </Link>
            <Link
              to="/mis-cursos"
              className={`navbar-btn ${isActive('/mis-cursos') ? 'active' : ''}`}
            >
              Mis cursos
            </Link>
          </>
        )}

        <Link
          to="/perfil"
          className={`navbar-btn ${isActive('/perfil') ? 'active' : ''}`}
        >
          Perfil
        </Link>

        <span className="navbar-user-name" aria-hidden="true">
          {user?.nombre || 'Usuario'}
        </span>

        <Button
          variant="primary"
          size="sm"
          onClick={handleLogout}
          className="navbar-logout"
        >
          Cerrar sesión
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;