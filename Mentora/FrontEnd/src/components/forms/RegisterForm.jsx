import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Select, Checkbox } from '../ui';

const validationSchema = Yup.object({
  nombre: Yup.string().trim().required('El nombre es obligatorio'),
  apellido: Yup.string().trim().required('El apellido es obligatorio'),
  correo: Yup.string()
    .trim()
    .email('Correo inválido')
    .required('El correo es obligatorio'),
  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  rol: Yup.string().required('Selecciona un rol'),
});

const ROLES = [
  { value: 'estudiante', label: 'Estudiante' },
  { value: 'instructor', label: 'Instructor' },
];

export function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      confirmPassword: '',
      rol: 'estudiante',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      try {
        await register(values);
        onSuccess?.();
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Error al registrarse');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="register-form" noValidate>
      {error && <div className="auth-error" role="alert">{error}</div>}

      <div className="form-row">
        <Input
          id="nombre"
          name="nombre"
          type="text"
          label="Nombre"
          placeholder="Juan"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && formik.errors.nombre}
          required
        />
        <Input
          id="apellido"
          name="apellido"
          type="text"
          label="Apellido"
          placeholder="Pérez"
          value={formik.values.apellido}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.apellido && formik.errors.apellido}
          required
        />
      </div>

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
        autoComplete="new-password"
        required
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
        autoComplete="new-password"
        required
      />

      <Select
        name="rol"
        label="Rol"
        placeholder="Selecciona tu rol"
        options={ROLES}
        value={formik.values.rol}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.rol && formik.errors.rol}
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        {loading ? 'Registrando...' : 'Crear cuenta'}
      </Button>
    </form>
  );
}

export default RegisterForm;