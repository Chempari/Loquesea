import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../Api/axios';
import { imageUrl } from '../utils';

const CATEGORIAS = ['programacion', 'diseno', 'negocios', 'musica', 'fotografia', 'marketing', 'desarrollo'];
const NIVELES = ['principiante', 'intermedio', 'avanzado'];

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
        <button className="btn-sm danger" type="button" onClick={onDelete}>X</button>
      </h3>
      {(lecciones || []).map((lec) => (
        <div key={lec._id} className="leccion-item" style={{ padding: '6px 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{lec.titulo}</span>
          <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{lec.url}</span>
          <button className="btn-sm danger" type="button" onClick={() => onDeleteLeccion(lec._id)}>X</button>
        </div>
      ))}
      {showForm ? (
        <div style={{ marginTop: 8 }}>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Titulo leccion" style={{ width: '100%', marginBottom: 4, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }} />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL YouTube/Vimeo" style={{ width: '100%', marginBottom: 4, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }} />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripcion (opcional)" style={{ width: '100%', marginBottom: 8, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }} />
          <button className="btn-sm" type="button" onClick={handleAddLeccion}>Guardar</button>
          <button className="btn-sm" type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 4 }}>Cancelar</button>
        </div>
      ) : (
        <button className="btn-outline" type="button" onClick={() => setShowForm(true)} style={{ marginTop: 8 }}>+ Agregar leccion</button>
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
      api.get(`/Cursos/${id}`)
        .then((res) => {
          const c = res.data.curso || res.data.data?.curso;
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
    api.get(`/Secciones?cursoID=${cursoId}`)
      .then((res) => {
        const s = res.data.secciones || [];
        Promise.all(s.map((sec) =>
          api.get(`/Lecciones?seccionID=${sec._id}`).then((r) => ({
            ...sec,
            lecciones: r.data.lecciones || []
          }))
        )).then(setSecciones);
      })
      .catch(console.error);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (cursoId) loadSecciones();
  }, [cursoId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurso((prev) => ({ ...prev, [name]: name === 'precio' ? Number(value) : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Imagen excede 2MB.'); return; }
    setSubiendoImagen(true);
    setError('');
    const fd = new FormData();
    fd.append('imagen', file);
    try {
      const res = await api.post('/uploads/course-cover', fd);
      setCurso((prev) => ({ ...prev, imagen: res.data.url }));
      setMessage('Imagen subida.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir');
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleSaveCurso = async (e) => {
    e.preventDefault();
    if (!curso.titulo.trim()) { setError('El titulo es obligatorio.'); return; }
    if (!curso.categoria) { setError('Selecciona una categoria.'); return; }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      let res;
      if (id) {
        res = await api.put(`/Cursos/${id}`, curso);
      } else {
        res = await api.post('/Cursos', curso);
      }
      const saved = res.data?.curso;
      if (!saved) { setError('Error: no se recibio el curso del servidor.'); return; }
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
      await api.post('/Secciones', { cursoID: cursoId, titulo: nuevoSeccion.trim() });
      setNuevoSeccion('');
      loadSecciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear seccion');
    }
  };

  const deleteSeccion = async (seId) => {
    if (!confirm('Eliminar esta seccion y sus lecciones?')) return;
    try {
      await api.delete(`/Secciones/${seId}`);
      loadSecciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  const addLeccion = async (seId, titulo, url, desc) => {
    if (!titulo.trim() || !url.trim()) return;
    try {
      await api.post('/Lecciones', {
        seccionID: seId,
        titulo: titulo.trim(),
        url: url.trim(),
        descripcion: desc.trim()
      });
      loadSecciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear leccion');
    }
  };

  const deleteLeccion = async (lecId) => {
    if (!confirm('Eliminar esta leccion?')) return;
    try {
      await api.delete(`/Lecciones/${lecId}`);
      loadSecciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="curso-form-page">
      <div className="curso-form-card">
        <h1>{isEditing ? 'Editar curso' : 'Crear curso'}</h1>

        {message && <div className="form-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSaveCurso}>
          <div className="form-group">
            <label>Imagen de portada</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="text" name="imagen" value={curso.imagen} onChange={handleChange} placeholder="URL o sube una" />
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()} disabled={subiendoImagen}>
                {subiendoImagen ? '...' : 'Subir'}
              </button>
            </div>
            {curso.imagen && (
              <img src={imageUrl(curso.imagen)} alt="" className="imagen-preview" />
            )}
          </div>

          <div className="form-group">
            <label>Titulo</label>
            <input name="titulo" value={curso.titulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Descripcion</label>
            <textarea name="descripcion" rows={4} value={curso.descripcion} onChange={handleChange} />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label>Categoria</label>
              <select name="categoria" value={curso.categoria} onChange={handleChange} required>
                <option value="">Selecciona...</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Nivel</label>
              <select name="nivel" value={curso.nivel} onChange={handleChange}>
                {NIVELES.map((n) => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Precio ($) - 0 = gratis</label>
            <input name="precio" type="number" min={0} value={curso.precio} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : (isEditing ? 'Guardar cambios' : 'Crear curso')}
          </button>
        </form>

        {cursoId && (
          <>
            <hr className="divider" />

            <div className="secciones-manager">
              <h2>Secciones</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  value={nuevoSeccion}
                  onChange={(e) => setNuevoSeccion(e.target.value)}
                  placeholder="Nombre de la seccion"
                  style={{ flex: 1 }}
                />
                <button className="btn-sm" type="button" onClick={addSeccion}>Agregar</button>
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
              <button className="btn-primary" type="button" onClick={() => navigate('/mis-cursos')}>
                Ir a mis cursos
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}