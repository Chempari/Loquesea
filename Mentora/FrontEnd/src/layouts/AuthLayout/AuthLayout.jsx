import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthBackground, Button } from '../../components';

export function AuthLayout() {
  const [fastMotion, setFastMotion] = useState(false);
  const [shakePulse, setShakePulse] = useState(0);

  return (
    <div className={`auth-page auth-page--slide-in-left${fastMotion ? ' auth-page--fast-motion' : ''}`}>
      <AuthBackground active={fastMotion} shakePulse={shakePulse} />

      <main className="auth-wrapper">
        <div className="auth-container">
          <Link to="/" className="auth-logo">
            MENTORA
          </Link>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;