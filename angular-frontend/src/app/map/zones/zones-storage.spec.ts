import { beforeEach, describe, expect, it } from 'vitest';
import { installMemoryStorage } from '@testutils/memory-storage';
import { loadZones, saveZones, ZONES_STORAGE_KEY } from './zones-storage';
import type { Zone } from './zone.model';

const ZONE: Zone = {
  id: 7,
  name: 'Zona de prueba',
  type: 'radio',
  center: [-17.4, -66.1],
  radiusMeters: 1000,
  activeEventsCount: 0,
};

describe('zones-storage', () => {
  beforeEach(() => {
    installMemoryStorage();
  });

  it('should return null when nothing is stored', () => {
    expect(loadZones()).toBeNull();
  });

  it('should save and load zones', () => {
    saveZones([ZONE]);

    expect(loadZones()).toEqual([ZONE]);
  });

  it('should ignore invalid JSON', () => {
    localStorage.setItem(ZONES_STORAGE_KEY, '{not-json');

    expect(loadZones()).toBeNull();
  });

  it('should ignore values that are not an array', () => {
    localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify({ id: 1 }));

    expect(loadZones()).toBeNull();
  });

  it('should drop invalid zone entries', () => {
    localStorage.setItem(
      ZONES_STORAGE_KEY,
      JSON.stringify([ZONE, { id: 'bad', name: 1 }, null, { ...ZONE, center: [1] }]),
    );

    expect(loadZones()).toEqual([ZONE]);
  });
});
