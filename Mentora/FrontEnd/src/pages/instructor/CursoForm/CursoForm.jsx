import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseService, uploadService } from '../../../services';
import { imageUrl } from '../../../utils';
import { CATEGORIAS, NIVELES } from '../../../constants';
import { Button, Input, Textarea, Select, Switch, Badge, Card } from '../../../components/ui';
import { Spinner } from '../../../components/ui';

function SeccionBlock({ seccion, lecciones, onDelete, onAddLeccion, onDeleteLeccion }) {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddLeccion = () => {
    onAddLeccion(titulo, url, desc);
    setTitulo('');
    setUrl('');
    setDesc('');
    setShowForm(false);
  };

  return (
    <div className="seccion-group">
      <h3>
        {seccion.titulo}
        <Button variant="danger" size="sm" onClick={onDelete}>×</Button>
      </h3>
      {(lecciones || []).map((lec) => (
        <div key={lec._id} className="leccion-item" style={{ padding: '6px 0', borderTop: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{lec.titulo}</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{lec.url}</span>
          <Button variant="danger" size="sm" onClick={() => onDeleteLeccion(lec._id)}>×</Button>
        </div>
      ))}
      {showForm ? (
        <div style={{ marginTop: 8 }}>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título lección" fullWidth />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL YouTube/Vimeo" fullWidth style={{ marginTop: 8 }} />
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción (opcional)" fullWidth style={{ marginTop: 8 }} rows={2} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button variant="primary" size="sm" onClick={handleAddLeccion}>Guardar</Button>
            <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setShowForm(true)} style={{ marginTop: 8 }}>+ Agregar lección</Button>
      )}
    </div>
  );
}

export function CursoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const isEditing = Boolean(id);

  const [curso, setCurso] = useState({
    titulo: '', descripcion: '', categoria: '', nivel: 'principiante', precio: 0, imagen: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [cursoId, setCursoId] = useState(id || null);
  const [secciones, setSecciones] = useState([]);
  const [nuevoSeccion, setNuevoSeccion] = useState('');

  useEffect(() => {
    if (id) {
      courseService.getById(id)
        .then((res) => {
          const c = res.data?.curso || res.data?.data?.curso;
          if (c) {
            setCurso({
              titulo: c.titulo || '',
              descripcion: c.descripcion || '',
              categoria: c.categoria || '',
              nivel: c.nivel || 'principiante',
              precio: c.precio || 0,
              imagen: c.imagen || ''
            });
            setCursoId(c._id);
          }
        })
        .catch(() => setError('No se pudo cargar el curso'));
    }
  }, [id]);

  const loadSecciones = () => {
    if (!cursoId) return;
    courseService.getAll({ cursoID: cursoId })
      .then((res) => {
        const s = res.data?.secciones || [];
        Promise.all(s.map((sec) =>
          courseService.getAll({ seccionID: sec._id }).then((r) => ({
            ...sec,
            lecciones: r.data?.lecciones || []
          }))
        )).then(setSecciones);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (cursoId) loadSecciones();
  }, [cursoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurso((prev) => ({ ...prev, [name]: name === 'precio' ? Number(value) : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato no permitido. Usa JPG, PNG, WEBP o GIF.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Imagen excede 2MB.');
      return;
    }

    setSubiendoImagen(true);
    setError('');
    setMessage('');
    try {
      const res = await uploadService.uploadCourseCover(file);
      setCurso((prev) => ({ ...prev, imagen: res.data?.url || res.data?.data?.url }));
      setMessage('Imagen subida correctamente.');
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setError(err.response?.data?.message || 'Error al subir imagen. Verifica el formato y tamaño.');
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleSaveCurso = async (e) => {
    e.preventDefault();
    if (!curso.titulo.trim()) { setError('El título es obligatorio.'); return; }
    if (!curso.categoria) { setError('Selecciona una categoría.'); return; }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      let res;
      if (id) {
        res = await courseService.update(id, curso);
      } else {
        res = await courseService.create(curso);
      }
      const saved = res.data?.curso || res.data?.data?.curso;
      if (!saved) { setError('Error: no se recibió el curso del servidor.'); return; }
      const newId = id || saved._id;
      setCursoId(newId);
      setMessage('Curso guardado correctamente.');
      if (!id) navigate(`/cursos/${newId}/editar`, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al guardar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const addSeccion = async () => {
    if (!nuevoSeccion.trim() || !cursoId) return;
    try {
      await courseService.create({ ...nuevoSeccion, cursoID: cursoId });
      setNuevoSeccion('');
      loadSecciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear sección');
    }
  };

  const deleteSeccion = async (seId) => {
    if (!confirm('Eliminar esta sección y sus lecciones?')) return;
    try {
      await courseService.delete(seId);
      loadSecciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  const addLeccion = async (seId, titulo, url, desc) => {
    if (!titulo.trim() || !url.trim()) return;
    try {
      await courseService.create({ seccionID: seId, titulo: titulo.trim(), url: url.trim(), descripcion: desc.trim() });
      loadSecciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear lección');
    }
  };

  const deleteLeccion = async (lecId) => {
    if (!confirm('Eliminar esta lección?')) return;
    try {
      await courseService.delete(lecId);
      loadSecciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="curso-form-page">
      <Card variant="glass" className="curso-form-card">
        <h1>{isEditing ? 'Editar curso' : 'Crear curso'}</h1>

        {message && <div className="form-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSaveCurso}>
          <div className="form-group">
            <label>Imagen de portada</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input name="imagen" value={curso.imagen} onChange={handleChange} placeholder="URL o sube una" />
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()} disabled={subiendoImagen}>
                {subiendoImagen ? '...' : 'Subir'}
              </Button>
            </div>
            {curso.imagen && (
              <img src={imageUrl(curso.imagen)} alt="" className="imagen-preview" />
            )}
          </div>

          <Input name="titulo" label="Título" value={curso.titulo} onChange={handleChange} required />

          <Textarea name="descripcion" label="Descripción" value={curso.descripcion} onChange={handleChange} rows={4} />

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Select
                name="categoria"
                label="Categoría"
                options={CATEGORIAS.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
                value={curso.categoria}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <Select
                name="nivel"
                label="Nivel"
                options={NIVELES.map((n) => ({ value: n, label: n.charAt(0).toUpperCase() + n.slice(1) }))}
                value={curso.nivel}
                onChange={handleChange}
              />
            </div>
          </div>

          <Input name="precio" type="number" label="Precio ($) - 0 = gratis" min={0} value={curso.precio} onChange={handleChange} />

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Guardando...' : (isEditing ? 'Guardar cambios' : 'Crear curso')}
          </Button>
        </form>

        {cursoId && (
          <>
            <hr className="divider" />

            <div className="secciones-manager">
              <h2>Secciones</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <Input
                  value={nuevoSeccion}
                  onChange={(e) => setNuevoSeccion(e.target.value)}
                  placeholder="Nombre de la sección"
                  style={{ flex: 1 }}
                />
                <Button variant="primary" size="sm" onClick={addSeccion}>Agregar</Button>
              </div>

              {secciones.map((sec) => (
                <SeccionBlock
                  key={sec._id}
                  seccion={sec}
                  lecciones={sec.lecciones}
                  onDelete={() => deleteSeccion(sec._id)}
                  onAddLeccion={(t, u, d) => addLeccion(sec._id, t, u, d)}
                  onDeleteLeccion={deleteLeccion}
                />
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <Button variant="primary" onClick={() => navigate('/mis-cursos')}>
                Ir a mis cursos
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default CursoForm;