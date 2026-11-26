import type { LatLng, Zone } from './zone.model';

export const ZONES_STORAGE_KEY = 'kocha-tracks.zones';

function getStorage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return typeof localStorage.getItem === 'function' ? localStorage : null;
  } catch {
    return null;
  }
}

function isLatLng(value: unknown): value is LatLng {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((coordinate) => typeof coordinate === 'number')
  );
}

function isZone(value: unknown): value is Zone {
  if (!value || typeof value !== 'object') return false;

  const zone = value as Record<string, unknown>;

  return (
    typeof zone['id'] === 'number' &&
    typeof zone['name'] === 'string' &&
    (zone['type'] === 'radio' || zone['type'] === 'polygon') &&
    typeof zone['activeEventsCount'] === 'number' &&
    (zone['center'] === undefined || isLatLng(zone['center'])) &&
    (zone['geometry'] === undefined ||
      (Array.isArray(zone['geometry']) && zone['geometry'].every(isLatLng)))
  );
}

export function loadZones(): Zone[] | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(ZONES_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed.filter(isZone);
  } catch {
    return null;
  }
}

export function saveZones(zones: Zone[]): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(ZONES_STORAGE_KEY, JSON.stringify(zones));
  } catch {
    // Almacenamiento no disponible (modo privado o cuota llena).
  }
}
