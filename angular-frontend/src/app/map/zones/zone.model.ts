export type ZoneType = 'radio' | 'polygon';

export type LatLng = [number, number];

export interface Zone {
  id: number;
  name: string;
  type: ZoneType;
  center?: LatLng;
  radiusMeters?: number;
  geometry?: LatLng[];
  activeEventsCount: number;
}

export type ZoneDraft =
  | { name: string; type: 'radio'; radiusMeters: number; center: LatLng | null }
  | { name: string; type: 'polygon'; points: LatLng[] };

export type ZoneMapOverlay =
  | {
      id: number | 'draft';
      type: 'radio';
      center: LatLng;
      radiusMeters: number;
      draft?: boolean;
    }
  | {
      id: number | 'draft';
      type: 'polygon';
      points: LatLng[];
      draft?: boolean;
    };

export const ZONE_RADIUS_MIN = 200;
export const ZONE_RADIUS_MAX = 5000;
export const ZONE_RADIUS_STEP = 100;
export const ZONE_RADIUS_DEFAULT = 1000;
export const ZONE_POLYGON_MIN_POINTS = 3;
