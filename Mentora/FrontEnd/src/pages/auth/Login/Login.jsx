import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { AuthBackground, SocialButtons, SignupRedirect } from '../shared';
import { LoginForm } from './components/LoginForm';
import '../shared/auth-shared.css';

export function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fastMotion, setFastMotion] = useState(false);
  const [shakePulse, setShakePulse] = useState(0);
  const interactionTimer = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleUserActivity = () => {
    setFastMotion(true);
    clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => setFastMotion(false), 900);
  };

  const handleFieldInteraction = (event) => {
    if (!event.target.closest('input, select')) return;
    setShakePulse((prev) => prev + 1);
  };

  const handleFormBlur = () => {
    clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => setFastMotion(false), 400);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(correo, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.request ? 'No se pudo conectar con el servidor. Verifica que el backend este corriendo.' : 'Error al iniciar sesion');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const pageClass = `auth-page auth-page--slide-in-left${fastMotion ? ' auth-page--fast-motion' : ''}`;

  return (
    <div className={pageClass}>
      <AuthBackground active={fastMotion} shakePulse={shakePulse} />

      <main className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">Iniciar sesión</h1>

          {error && <div className="auth-error-msg">{error}</div>}

          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            correo={correo}
            setCorreo={setCorreo}
            password={password}
            setPassword={setPassword}
          />

          <SocialButtons title="Iniciar sesión con" />

          <SignupRedirect
            text="¿No tienes cuenta?"
            linkText="Regístrate aquí"
            to="/register"
          />
        </div>
      </main>
    </div>
  );
}
