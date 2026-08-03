import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contrasena</label>
            <input
              id="password"
              type="password"
              placeholder="Tu contrasena"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Login'}
          </button>
        </form>

        <p className="auth-redirect">
          No tienes cuenta? <Link to="/register">Registrate aqui</Link>
        </p>
      </div>
    </div>
  );
}