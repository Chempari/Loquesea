export const NIVELES = [
  'principiante',
  'intermedio',
  'avanzado',
];

export const NIVELES_LABELS = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

export function getLevelLabel(level) {
  return NIVELES_LABELS[level] || level.charAt(0).toUpperCase() + level.slice(1);
}

export const NIVEL_ORDER = {
  principiante: 1,
  intermedio: 2,
  avanzado: 3,
};