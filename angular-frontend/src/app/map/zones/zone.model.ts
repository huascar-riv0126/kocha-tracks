export type ZoneType = 'radio' | 'polygon';

export type LatLng = [number, number];

export interface Zone {
  id: number;
  name: string;
  type: ZoneType;
  radiusMeters?: number;
  activeEventsCount: number;
}

export type ZoneDraft =
  | { name: string; type: 'radio'; radiusMeters: number; center: LatLng | null }
  | { name: string; type: 'polygon'; points: LatLng[] };

export const ZONE_RADIUS_MIN = 200;
export const ZONE_RADIUS_MAX = 5000;
export const ZONE_RADIUS_STEP = 100;
export const ZONE_RADIUS_DEFAULT = 1500;
export const ZONE_POLYGON_MIN_POINTS = 3;
