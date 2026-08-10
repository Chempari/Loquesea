import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';

export function PublicLayout({ title }) {
  return (
    <div className="public-layout">
      <Navbar variant="public" />
      <main className="public-main">
        {title && (
          <header className="page-header">
            <h1 className="page-title">{title}</h1>
          </header>
        )}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default PublicLayout;