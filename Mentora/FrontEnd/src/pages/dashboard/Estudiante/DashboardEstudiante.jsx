import { useState, useEffect } from 'react';
import api from '../../../Api/axios';
import { EstudianteHeader } from './components/EstudianteHeader';
import { ResumenCards } from './components/ResumenCards';
import { CursosLista } from './components/CursosLista';
import './DashboardEstudiante.css';

export function DashboardEstudiante() {
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

  return (
    <>
      <div className="dashboard-wrapper">
        <main className="main-content">
          <EstudianteHeader />
          <ResumenCards resumen={resumen} loading={loading} />

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
              <CursosLista inscripciones={inscripciones} />
            </>
          )}
        </main>
      </div>
    </>
  );
}
