import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LayoutBackground } from './LayoutBackground';

export function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    import('../temp/dashboard.css');
  }, []);

  useEffect(() => {
    const content = document.querySelector('.layout-page-transition');
    if (!content) return;

    content.classList.remove('page-enter');
    void content.offsetWidth;
    content.classList.add('page-enter');
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Fondo Geométrico Global para toda la app */}
      <LayoutBackground />

      {/* NAVBAR GLASSMORPHISM GLOBAL */}
      <nav className="glass-navbar" style={{ zIndex: 100 }}>
        <Link to="/dashboard" className="logo" style={{ textDecoration: 'none' }}>
          MENTORA
        </Link>

        {/* Buscador visual (opcional a nivel global) */}
        <div className="search-container input-container">
          <input
            type="text"
            placeholder="Buscar cursos..."
            className="round-input search-input"
          />
          <span className="input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>

        <div className="auth-buttons">
          <Link to="/explorar" className="btn-text" style={{ textDecoration: 'none' }}>Explorar</Link>
          <Link to="/dashboard" className="btn-text" style={{ textDecoration: 'none' }}>Dashboard</Link>

          {/* Opciones exclusivas para instructor */}
          {user?.rol === 'instructor' && (
            <>
              <Link to="/cursos/nuevo" className="btn-text" style={{ textDecoration: 'none' }}>Crear curso</Link>
              <Link to="/mis-cursos" className="btn-text" style={{ textDecoration: 'none' }}>Mis cursos</Link>
            </>
          )}

          <Link to="/perfil" className="btn-text" style={{ textDecoration: 'none' }}>Perfil</Link>

          {/* Nombre del usuario dinámico */}
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginLeft: '8px', fontWeight: 500 }}>
            {user?.nombre || 'Usuario'}
          </span>

          {/* Botón de cerrar sesión unificado */}
          <button className="btn-primary-round btn-nav" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <main key={location.pathname} className="main-content layout-page-transition" style={{ position: 'relative', zIndex: 10 }}>
        {/* Renderizado de título dinámico si se pasa la prop 'title' */}
        {title && (
          <div className="header-section" style={{ marginBottom: '24px' }}>
            <h1 className="login-title" style={{ textAlign: 'left' }}>{title}</h1>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}