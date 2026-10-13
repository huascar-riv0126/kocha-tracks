import { Zone } from './zone.model';

export const ZONES_MOCK: Zone[] = [
  {
    id: 1,
    name: 'Mi casa - Zona Norte',
    type: 'radio',
    radiusMeters: 1500,
    activeEventsCount: 3,
  },
  {
    id: 2,
    name: 'Trabajo - Av. América',
    type: 'polygon',
    activeEventsCount: 1,
  },
  {
    id: 3,
    name: 'Universidad UMSS',
    type: 'radio',
    radiusMeters: 2000,
    activeEventsCount: 0,
  },
];
