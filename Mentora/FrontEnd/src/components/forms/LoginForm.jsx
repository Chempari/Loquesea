import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Checkbox } from '../ui';

const validationSchema = Yup.object({
  correo: Yup.string()
    .trim()
    .email('Correo inválido')
    .required('El correo es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria'),
});

export function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { correo: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      try {
        await login(values.correo, values.password);
        onSuccess?.();
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="login-form" noValidate>
      {error && <div className="auth-error" role="alert">{error}</div>}

      <Input
        id="correo"
        name="correo"
        type="email"
        label="Correo"
        placeholder="tu@email.com"
        value={formik.values.correo}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.correo && formik.errors.correo}
        autoComplete="email"
        required
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
        autoComplete="current-password"
        required
      />

      <div className="form-options">
        <Checkbox
          name="remember"
          label="Recordarme"
          checked={formik.values.remember}
          onChange={formik.handleChange}
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