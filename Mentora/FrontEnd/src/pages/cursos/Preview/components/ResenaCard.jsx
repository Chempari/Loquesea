import { imageUrl } from '../../../../utils';

export function ResenaCard({ resena }) {
  return (
    <div className="resena-card">
      <div className="resena-header">
        {resena.estudiante_id?.foto ? (
          <img src={imageUrl(resena.estudiante_id.foto)} alt="" />
        ) : (
          <div className="perfil-photo-placeholder" style={{ width: 32, height: 32, fontSize: 14 }}>
            {resena.estudiante_id?.nombre?.charAt(0) || '?'}
          </div>
        )}
        <span className="resena-name">{resena.estudiante_id?.nombre || 'Anonimo'}</span>
        <span className="resena-stars" style={{ color: '#f59e0b' }}>
          {'\u2605'.repeat(resena.calificacion)}{'\u2606'.repeat(5 - resena.calificacion)}
        </span>
      </div>
      {resena.comentario && <p className="resena-comentario">{resena.comentario}</p>}
    </div>
  );
}
