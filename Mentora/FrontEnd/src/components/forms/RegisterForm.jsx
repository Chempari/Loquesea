import { useState } from 'react';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Select, Checkbox } from '../ui';

const ROLES = [
  { value: 'estudiante', label: 'Estudiante' },
  { value: 'instructor', label: 'Instructor' },
];

export function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('estudiante');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) { setError('El nombre es obligatorio'); return; }
    if (!apellido.trim()) { setError('El apellido es obligatorio'); return; }
    if (!correo.trim()) { setError('El correo es obligatorio'); return; }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return; }
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }

    setLoading(true);
    try {
      await register({ nombre, apellido, correo, password, rol });
      onSuccess?.();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="register-form" noValidate>
      {error && <div className="auth-error" role="alert">{error}</div>}

      <div className="form-row">
        <Input
          id="nombre"
          name="nombre"
          type="text"
          label="Nombre"
          placeholder="Juan"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => handleBlur('nombre')}
          error={touched.nombre && !nombre.trim() ? 'El nombre es obligatorio' : ''}
          required
        />
        <Input
          id="apellido"
          name="apellido"
          type="text"
          label="Apellido"
          placeholder="Pérez"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          onBlur={() => handleBlur('apellido')}
          error={touched.apellido && !apellido.trim() ? 'El apellido es obligatorio' : ''}
          required
        />
      </div>

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
        error={touched.password && password.length < 6 ? 'Mínimo 6 caracteres' : ''}
        autoComplete="new-password"
        required
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={() => handleBlur('confirmPassword')}
        error={touched.confirmPassword && password !== confirmPassword ? 'Las contraseñas no coinciden' : ''}
        autoComplete="new-password"
        required
      />

      <Select
        name="rol"
        label="Rol"
        placeholder="Selecciona tu rol"
        options={ROLES}
        value={rol}
        onChange={(e) => setRol(e.target.value)}
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