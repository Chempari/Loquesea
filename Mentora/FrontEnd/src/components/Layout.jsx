import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/dashboard">Mentora</Link>
        </div>
        <div className="navbar-links">
          <Link to="/explorar">Explorar</Link>
          <Link to="/dashboard">Dashboard</Link>
          {user?.rol === 'instructor' && (
            <>
              <Link to="/cursos/nuevo">Crear curso</Link>
              <Link to="/mis-cursos">Mis cursos</Link>
            </>
          )}
          <Link to="/perfil">Perfil</Link>
        </div>
        <div className="navbar-user">
          <span className="navbar-name">{user?.nombre}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </nav>
      <main className="main-content">
        {title && <h1 className="page-title">{title}</h1>}
        {children}
      </main>
    </div>
  );
}