import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { LayoutBackground, Navbar } from '../../components';
import './DashboardLayout.css';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      <LayoutBackground />
      <Navbar variant="dashboard" />
      <main
        key={location.pathname}
        className="main-content layout-page-transition"
        role="main"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;