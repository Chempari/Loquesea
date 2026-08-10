import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../hooks';
import { authService, uploadService } from '../../../services';
import { imageUrl } from '../../../utils';
import { Button, Input, Textarea, Avatar } from '../../../components/ui';
import { Spinner } from '../../../components/ui';

export function Perfil() {
  const { user, updateUser } = useAuth();
  const [nombre, setNombre] = useState('');
  const [biografia, setBiografia] = useState('');
  const [redesSociales, setRedesSociales] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    authService.me()
      .then((res) => {
        const u = res.data.data;
        setNombre(u.nombre || '');
        setBiografia(u.biografia || '');
        setRedesSociales(Array.isArray(u.redes_sociales) ? u.redes_sociales.join('\n') : '');
        setFotoUrl(u.foto || '');
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar perfil'));
  }, []);

  const handleFotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato no permitido. Usa JPG, PNG, WEBP o GIF.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen excede 2MB.');
      return;
    }

    setSubiendoFoto(true);
    setError('');
    setMessage('');

    try {
      const res = await uploadService.uploadProfilePhoto(file);
      const newUrl = res.data?.url || res.data?.data?.url;
      setFotoUrl(newUrl);
      setMessage('Foto actualizada correctamente.');
    } catch (err) {
      console.error('Error al subir foto:', err);
      setError(err.response?.data?.message || 'Error al subir foto. Verifica el formato y tamaño.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const redesArray = redesSociales
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await authService.updateProfile({
        nombre,
        biografia,
        foto: fotoUrl,
        redes_sociales: redesArray
      });

      updateUser({ nombre, biografia, foto: fotoUrl, redes_sociales: redesArray });

      setMessage('Perfil actualizado correctamente.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil-page">
      <div className="perfil-card">
        <div className="perfil-photo-section">
          <Avatar
            src={fotoUrl}
            name={nombre}
            size="xl"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFotoUpload}
            style={{ display: 'none' }}
          />
          <Button
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            disabled={subiendoFoto}
          >
            {subiendoFoto ? 'Subiendo...' : 'Cambiar foto'}
          </Button>
        </div>

        {message && <div className="form-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            id="nombre"
            name="nombre"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <Textarea
            id="biografia"
            name="biografia"
            label="Biografía"
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            rows={4}
          />

          <Textarea
            id="redes"
            name="redes"
            label="Redes sociales (una por línea)"
            placeholder="https://twitter.com/usuario&#10;https://github.com/usuario"
            value={redesSociales}
            onChange={(e) => setRedesSociales(e.target.value)}
            rows={3}
          />

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Perfil;