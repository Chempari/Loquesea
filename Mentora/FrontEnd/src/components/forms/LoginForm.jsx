import { useState } from 'react';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Checkbox } from '../ui';

export function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo.trim()) {
      setError('El correo es obligatorio');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria');
      return;
    }

    setLoading(true);
    try {
      await login(correo, password);
      onSuccess?.();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="login-form" noValidate>
      {error && <div className="auth-error" role="alert">{error}</div>}

      <Input
        id="correo"
        name="correo"
        type="email"
        label="Correo"
        placeholder="tu@email.com"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        onBlur={() => handleBlur('correo')}
        error={touched.correo && !correo.trim() ? 'El correo es obligatorio' : ''}
        autoComplete="email"
        required
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur('password')}
        error={touched.password && !password ? 'La contraseña es obligatoria' : ''}
        autoComplete="current-password"
        required
      />

      <div className="form-options">
        <Checkbox
          name="remember"
          label="Recordarme"
        />
        <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}

export default LoginForm;