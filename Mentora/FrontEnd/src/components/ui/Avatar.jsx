import { useState, useRef } from 'react';

export function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
  onClick,
  ...props
}) {
  const sizeClasses = {
    xs: 'avatar-xs',
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  };

  const classNames = [
    'avatar',
    sizeClasses[size] || sizeClasses.md,
    className,
  ].filter(Boolean).join(' ');

  const hasImage = src && !src.includes('placeholder');
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const Content = hasImage ? (
    <img src={src} alt={alt || name || 'Avatar'} className="avatar-img" />
  ) : (
    <span className="avatar-placeholder">{initials || '?'}</span>
  );

  return (
    <div
      className={classNames}
      onClick={onClick}
      {...props}
    >
      {Content}
    </div>
  );
}

export function AvatarUpload({
  value,
  onChange,
  onRemove,
  label = 'Cambiar foto',
  accept = 'image/*',
  maxSize = 2 * 1024 * 1024,
  className = '',
  ...props
}) {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      alert('Formato no permitido. Usa JPG, PNG, WEBP o GIF.');
      return;
    }

    if (file.size > maxSize) {
      alert(`La imagen excede ${maxSize / 1024 / 1024}MB.`);
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onChange?.(file);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    onRemove?.();
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className={`avatar-upload ${className}`}>
      <Avatar src={preview} size="xl" name={label} />
      <div className="avatar-upload-actions">
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Subiendo...' : label}
        </button>
        {preview && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleRemove}
            disabled={uploading}
            aria-label="Eliminar imagen"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default Avatar;