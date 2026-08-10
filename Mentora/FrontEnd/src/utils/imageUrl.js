const API_BASE = 'http://localhost:3977';

export function imageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/images/') || path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  if (path.startsWith('data:')) return path;
  return path;
}

export function getImageUrl(path) {
  return imageUrl(path);
}