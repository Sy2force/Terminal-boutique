const CATALOG_EPOCH = Date.UTC(2026, 7, 25);

export function formatPrice(value: number) {
  const rounded = Math.round(value);
  return `${rounded.toLocaleString("fr-FR")} ₪`;
}

export function daysAgoIso(days: number) {
  const date = new Date(CATALOG_EPOCH - days * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

export function arrivalLabel(createdAtIso: string) {
  const created = new Date(createdAtIso).getTime();
  const diffMs = CATALOG_EPOCH - created;
  const days = Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));

  if (days === 0) return "Arrivé aujourd'hui";
  if (days === 1) return "Arrivé hier";
  return `Arrivé il y a ${days} jours`;
}
