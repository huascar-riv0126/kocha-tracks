import { Zone } from './zone.model';

export const ZONES_MOCK: Zone[] = [
  {
    id: 1,
    name: 'Mi casa - Zona Norte',
    type: 'radio',
    center: [-17.3753, -66.1568],
    radiusMeters: 1500,
    activeEventsCount: 3,
  },
  {
    id: 2,
    name: 'Trabajo - Av. América',
    type: 'polygon',
    geometry: [
      [-17.383, -66.165],
      [-17.382, -66.16],
      [-17.387, -66.159],
      [-17.388, -66.1645],
    ],
    activeEventsCount: 1,
  },
  {
    id: 3,
    name: 'Universidad UMSS',
    type: 'radio',
    center: [-17.3935, -66.155],
    radiusMeters: 2000,
    activeEventsCount: 0,
  },
];
