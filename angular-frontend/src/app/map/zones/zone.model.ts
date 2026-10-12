export type ZoneType = 'radio' | 'polygon';

export interface Zone {
  id: number;
  name: string;
  type: ZoneType;
  radiusMeters?: number;
  activeEventsCount: number;
}
