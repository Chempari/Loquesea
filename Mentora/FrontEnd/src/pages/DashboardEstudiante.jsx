import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Api/axios';

export function DashboardEstudiante() {
  // ==========================================
  // LÓGICA FUNCIONAL INTACTA (JS)
  // ==========================================
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    api.get('/Dashboard/estudiante')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const resumen = data?.resumen || {};
  const inscripciones = data?.inscripciones || [];


  // ==========================================
  // VISTA CORREGIDA CON UN SOLO ENCABEZADO
  // ==========================================
  return (
    <>
      {/* Fondo Geométrico del HTML */}

      <div className="dashboard-wrapper">

        {/* ÚNICO ENCABEZADO GLASSMORPHISM */}
        <main className="main-content">
          {/* ENCABEZADO DE SECCIÓN Y FILTROS */}
          <div className="header-section">
            <div className="title-block">
              <h1 className="login-title" style={{ marginBottom: '8px', textAlign: 'left' }}>Panel Estudiante</h1>
              <p className="subtitle">Resumen de tu progreso y cursos inscritos.</p>
            </div>

            <div className="filters-group">
              <div className="glass-dropdown">
                <span>Categorías: <strong>Todas</strong></span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className="glass-dropdown">
                <span>Nivel: <strong>Todos</strong></span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className="glass-dropdown">
                <span>Precio: <strong>Todos</strong></span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          {/* TARJETAS DE RESUMEN INTEGRADAS EN ESTILO GLASS */}
          <div style={{ marginBottom: '40px', display: 'flex', gap: '24px' }}>
            <div className="glass-dropdown" style={{ flex: 1, padding: '20px', flexDirection: 'column', alignItems: 'flex-start', cursor: 'default' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--blanco-puro)' }}>
                {loading ? '...' : resumen.total_cursos ?? 0}
              </span>
              <span style={{ fontSize: '14px', color: 'rgba(232, 240, 236, 0.7)' }}>Cursos inscritos</span>
            </div>

            <div className="glass-dropdown" style={{ flex: 1, padding: '20px', flexDirection: 'column', alignItems: 'flex-start', cursor: 'default' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--blanco-puro)' }}>
                {loading ? '...' : resumen.cursos_completados ?? 0}
              </span>
              <span style={{ fontSize: '14px', color: 'rgba(232, 240, 236, 0.7)' }}>Completados</span>
            </div>

            <div className="glass-dropdown" style={{ flex: 1, padding: '20px', flexDirection: 'column', alignItems: 'flex-start', cursor: 'default' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--blanco-puro)' }}>
                {loading ? '...' : `${resumen.progreso_promedio ?? 0}%`}
              </span>
              <span style={{ fontSize: '14px', color: 'rgba(232, 240, 236, 0.7)' }}>Progreso promedio</span>
            </div>
          </div>

          {/* LISTADO DE CURSOS Y ESTADOS DE CARGA */}
          {loading ? (
            <div style={{ color: 'var(--blanco-puro)', textAlign: 'center', padding: '40px', fontSize: '18px' }}>
              Cargando tus cursos...
            </div>
          ) : error ? (
            <div style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px', background: 'rgba(255,0,0,0.1)', borderRadius: '12px', border: '1px solid rgba(255,0,0,0.2)' }}>
              {error}
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--blanco-puro)', marginBottom: '24px' }}>
                Mis cursos
              </h2>

              {inscripciones.length === 0 ? (
                <p style={{ color: 'rgba(232, 240, 236, 0.7)', fontSize: '16px' }}>
                  No estás inscrito en ningún curso. <Link to="/explorar" style={{ color: 'var(--verde-intermedio-luz)', textDecoration: 'none', fontWeight: 600 }}>Explora cursos aquí</Link>
                </p>
              ) : (
                <div className="courses-grid">
                  {inscripciones.map((insc) => (
                    <Link
                      to={`/cursos/${insc.curso_id?._id}/aprender`}
                      key={insc._id}
                      className="glass-card course-card"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="card-image-placeholder">IMAGEN CURSO</div>

                      <div className="card-info">
                        <h3 className="card-title">{insc.curso_id?.titulo || 'Curso sin título'}</h3>
                        <p className="card-description">{insc.curso_id?.descripcion || ''}</p>

                        <div className="card-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                          <span className="tag-glass">{insc.curso_id?.nivel || 'Sin nivel'}</span>
                          <span className="price-glass">{insc.curso_id?.precio ? insc.curso_id.precio : 'Gratis'}</span>
                        </div>

                        {/* Barra de progreso adaptada */}
                        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'rgba(232, 240, 236, 0.8)', fontWeight: 600 }}>
                            <span>Progreso</span>
                            <span>{insc.porcentaje ?? 0}%</span>
                          </div>
                          <div style={{ background: 'rgba(255, 255, 255, 0.1)', height: '6px', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${insc.porcentaje ?? 0}%`,
                              height: '100%',
                              background: 'var(--verde-intermedio-luz)',
                              borderRadius: '10px',
                              transition: 'width 0.5s ease-in-out'
                            }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}