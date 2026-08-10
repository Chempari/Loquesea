export const CATEGORIAS = [
  'programacion',
  'diseno',
  'negocios',
  'musica',
  'fotografia',
  'marketing',
  'desarrollo',
];

export const CATEGORIAS_LABELS = {
  programacion: 'Programación',
  diseno: 'Diseño',
  negocios: 'Negocios',
  musica: 'Música',
  fotografia: 'Fotografía',
  marketing: 'Marketing',
  desarrollo: 'Desarrollo',
};

export function getCategoryLabel(category) {
  return CATEGORIAS_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1);
}