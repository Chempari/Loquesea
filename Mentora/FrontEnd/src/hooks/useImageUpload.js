import { useState, useCallback } from 'react';
import { uploadService } from '../services';

export function useImageUpload(uploadType = 'profile') {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');

  const upload = useCallback(async (file) => {
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

    setUploading(true);
    setError('');
    try {
      let res;
      if (uploadType === 'profile') {
        res = await uploadService.uploadProfilePhoto(file);
      } else if (uploadType === 'course') {
        res = await uploadService.uploadCourseCover(file);
      } else {
        throw new Error('Tipo de subida no válido');
      }
      const newUrl = res.data?.url || res.data?.data?.url;
      setUrl(newUrl);
      return newUrl;
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setError(err.response?.data?.message || 'Error al subir imagen. Verifica el formato y tamaño.');
    } finally {
      setUploading(false);
    }
  }, [uploadType]);

  const reset = () => {
    setUrl('');
    setError('');
    setUploading(false);
  };

  return { upload, uploading, error, url, setUrl, reset };
}