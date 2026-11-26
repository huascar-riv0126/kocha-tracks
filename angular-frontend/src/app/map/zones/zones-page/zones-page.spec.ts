import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ZonesPage } from './zones-page';
import { ZonesList } from '../zones-list/zones-list';
import { ZoneConfig } from '../zone-config/zone-config';
import { ZoneCard } from '../zone-card/zone-card';
import { StringsService } from '../../../core/strings/strings-service/strings-service';
import { installMemoryStorage } from '@testutils/memory-storage';
import { StringsServiceStub } from '@testutils/stubs';
import { routes } from '../../../app.routes';
import { ZONES_MOCK } from '../zones-mock';
import { ZONE_RADIUS_DEFAULT } from '../zone.model';
import { ZONES_STORAGE_KEY } from '../zones-storage';

vi.mock('leaflet', () => {
  const layer = () => ({ addTo: vi.fn().mockReturnThis() });
  const popupMock = {
    setLatLng: vi.fn().mockReturnThis(),
    setContent: vi.fn().mockReturnThis(),
    openOn: vi.fn().mockReturnThis(),
    close: vi.fn(),
    getElement: vi.fn(() => document.createElement('div')),
  };
  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
    on: vi.fn(),
  };
  const leafletApi = {
    map: vi.fn(() => mapMock),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    circleMarker: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      openPopup: vi.fn(),
    })),
    circle: vi.fn(layer),
    polygon: vi.fn(layer),
    polyline: vi.fn(layer),
    layerGroup: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      clearLayers: vi.fn(),
    })),
    popup: vi.fn(() => popupMock),
  };

  return { ...leafletApi, default: leafletApi };
});

describe('ZonesPage', () => {
  let component: ZonesPage;
  let fixture: ComponentFixture<ZonesPage>;

  beforeEach(async () => {
    installMemoryStorage();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ZonesPage],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: StringsService, useClass: StringsServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZonesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render list and map with the zone config hidden', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(fixture.debugElement.query(By.directive(ZonesList))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeNull();
    expect(el.querySelector('[data-testid="map-canvas"]')?.getAttribute('id')).toBe('zones-map');
  });

  it('should start with the mock zones selected and no editing zone', () => {
    expect(component.zones()).toHaveLength(ZONES_MOCK.length);
    expect(component.selectedId()).toBe(1);
    expect(component.editingZone()).toBeNull();
    expect(component.isDrafting()).toBe(false);
    const cards = fixture.debugElement.queryAll(By.directive(ZoneCard));
    expect(cards).toHaveLength(ZONES_MOCK.length);
    expect(fixture.nativeElement.querySelector('[data-testid="zone-config-name"]')).toBeNull();
  });

  it('should show the zone config after starting a new zone', () => {
    component.onCreateNew();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeTruthy();
  });

  it('should show the zone config after clicking edit', () => {
    component.onEditZone(ZONES_MOCK[1]);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeTruthy();
    expect(component.editingZone()?.id).toBe(2);
  });

  it('should hide the zone config after save', () => {
    component.onEditZone(ZONES_MOCK[0]);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeTruthy();

    component.onSave({
      name: 'Casa nueva',
      type: 'radio',
      radiusMeters: 2000,
      center: [-17.38, -66.15],
    });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeNull();
  });

  it('should expose the selected zone as a map overlay', () => {
    const overlays = component.mapOverlays();
    expect(overlays).toHaveLength(1);
    expect(overlays[0]).toMatchObject({
      id: 1,
      type: 'radio',
      center: ZONES_MOCK[0].center,
      radiusMeters: ZONES_MOCK[0].radiusMeters,
    });
  });

  it('should update selection when a zone is selected', () => {
    component.onZoneSelected(ZONES_MOCK[1]);
    expect(component.selectedId()).toBe(2);
    const overlays = component.mapOverlays();
    expect(overlays).toHaveLength(1);
    expect(overlays[0]).toMatchObject({ id: 2, type: 'polygon' });
  });

  it('should switch to create mode on createNew', () => {
    component.onCreateNew();
    expect(component.selectedId()).toBeNull();
    expect(component.editingId()).toBeNull();
    expect(component.editingZone()).toBeNull();
    expect(component.creating()).toBe(true);
    expect(component.mapOverlays()).toEqual([]);
  });

  it('should set editing zone on edit', () => {
    component.onEditZone(ZONES_MOCK[2]);
    expect(component.editingId()).toBe(3);
    expect(component.selectedId()).toBe(3);
    expect(component.draftType()).toBe('radio');
    expect(component.draftRadius()).toBe(ZONES_MOCK[2].radiusMeters);
  });

  it('should remove the zone on delete', () => {
    component.onDeleteZone(ZONES_MOCK[0]);
    expect(component.zones().find((zone) => zone.id === 1)).toBeUndefined();
    expect(component.selectedId()).toBeNull();
    expect(component.editingId()).toBeNull();
    expect(component.mapOverlays()).toEqual([]);
  });

  it('should update the zone name and leave edit mode on save', () => {
    component.onEditZone(ZONES_MOCK[0]);
    component.onSave({
      name: 'Casa nueva',
      type: 'radio',
      radiusMeters: 2000,
      center: [-17.38, -66.15],
    });
    expect(component.zones()[0].name).toBe('Casa nueva');
    expect(component.zones()[0].radiusMeters).toBe(2000);
    expect(component.zones()[0].center).toEqual([-17.38, -66.15]);
    expect(component.editingId()).toBeNull();
    expect(component.creating()).toBe(false);
    expect(component.selectedId()).toBe(1);
    expect(component.isDrafting()).toBe(false);
    expect(component.mapOverlays()[0]).toMatchObject({
      id: 1,
      type: 'radio',
      center: [-17.38, -66.15],
      radiusMeters: 2000,
    });
  });

  it('should append a zone and leave create mode on save', () => {
    component.onCreateNew();
    component.onSave({
      name: 'Nueva zona',
      type: 'radio',
      radiusMeters: 500,
      center: [-17.4, -66.1],
    });
    expect(component.zones()).toHaveLength(ZONES_MOCK.length + 1);
    const created = component.zones()[component.zones().length - 1];
    expect(created.activeEventsCount).toBe(0);
    expect(created.center).toEqual([-17.4, -66.1]);
    expect(component.selectedId()).toBe(created.id);
    expect(component.editingId()).toBeNull();
    expect(component.creating()).toBe(false);
    expect(component.isDrafting()).toBe(false);
    expect(component.mapOverlays()[0]).toMatchObject({
      id: created.id,
      type: 'radio',
      center: [-17.4, -66.1],
    });
  });

  it('should persist created zones in localStorage', () => {
    component.onCreateNew();
    component.onSave({
      name: 'Zona persistida',
      type: 'radio',
      radiusMeters: 1000,
      center: [-17.4, -66.1],
    });

    const stored = JSON.parse(localStorage.getItem(ZONES_STORAGE_KEY) ?? '[]') as Array<{
      id: number;
      name: string;
    }>;
    expect(stored).toHaveLength(ZONES_MOCK.length + 1);
    expect(stored[stored.length - 1].name).toBe('Zona persistida');
  });

  it('should persist deletions in localStorage', () => {
    component.onDeleteZone(ZONES_MOCK[0]);

    const stored = JSON.parse(localStorage.getItem(ZONES_STORAGE_KEY) ?? '[]') as Array<{
      id: number;
    }>;
    expect(stored.some((zone) => zone.id === 1)).toBe(false);
  });

  it('should restore persisted zones from localStorage on init', async () => {
    localStorage.setItem(
      ZONES_STORAGE_KEY,
      JSON.stringify([
        {
          id: 42,
          name: 'Zona guardada',
          type: 'radio',
          center: [-17.4, -66.1],
          radiusMeters: 1000,
          activeEventsCount: 0,
        },
      ]),
    );

    const restoredFixture = TestBed.createComponent(ZonesPage);
    restoredFixture.detectChanges();
    await restoredFixture.whenStable();
    restoredFixture.detectChanges();

    expect(restoredFixture.componentInstance.zones()).toHaveLength(1);
    expect(restoredFixture.componentInstance.zones()[0].name).toBe('Zona guardada');
  });

  it('should create a radio zone by clicking the map with a 1 km default radius', () => {
    component.onCreateNew();
    component.onMapClick([-17.4, -66.1]);

    expect(component.draftCenter()).toEqual([-17.4, -66.1]);
    expect(component.draftRadius()).toBe(ZONE_RADIUS_DEFAULT);
    expect(component.mapOverlays()[0]).toMatchObject({
      type: 'radio',
      center: [-17.4, -66.1],
      radiusMeters: ZONE_RADIUS_DEFAULT,
    });
  });

  it('should add and undo polygon points while creating', () => {
    component.onCreateNew();
    component.onTypeChange('polygon');
    component.onMapClick([-17.38, -66.15]);
    component.onMapClick([-17.39, -66.16]);
    component.onMapClick([-17.4, -66.17]);

    expect(component.draftPoints()).toHaveLength(3);
    expect(component.mapOverlays()[0]).toMatchObject({ type: 'polygon' });

    component.onUndoPoint();
    expect(component.draftPoints()).toHaveLength(2);
    expect(component.draftPoints()[1]).toEqual([-17.39, -66.16]);

    component.onClearPoints();
    expect(component.draftPoints()).toHaveLength(0);
  });

  it('should persist polygon geometry on save', () => {
    component.onCreateNew();
    component.onTypeChange('polygon');
    const points: [number, number][] = [
      [-17.38, -66.15],
      [-17.39, -66.16],
      [-17.4, -66.17],
    ];
    component.onSave({ name: 'Polígono', type: 'polygon', points });

    const created = component.zones()[component.zones().length - 1];
    expect(created.type).toBe('polygon');
    expect(created.geometry).toEqual(points);
    expect(component.editingId()).toBeNull();
    expect(component.creating()).toBe(false);
    expect(component.mapOverlays()[0]).toMatchObject({
      id: created.id,
      type: 'polygon',
      points,
    });
  });

  it('should not draw any zone when nothing is selected, edited or created', () => {
    component.selectedId.set(null);
    component.editingId.set(null);
    component.creating.set(false);

    expect(component.mapOverlays()).toEqual([]);
  });

  it('should leave create mode and hide the config on cancel', () => {
    component.onCreateNew();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeTruthy();

    component.onCancel();
    fixture.detectChanges();

    expect(component.creating()).toBe(false);
    expect(component.editingId()).toBeNull();
    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeNull();
  });

  it('should leave edit mode and hide the config on cancel', () => {
    component.onEditZone(ZONES_MOCK[0]);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeTruthy();

    component.onCancel();
    fixture.detectChanges();

    expect(component.editingId()).toBeNull();
    expect(component.isDrafting()).toBe(false);
    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeNull();
  });

  it('should expose the zonas-interes route', () => {
    const route = routes.find((item) => item.path === 'zonas-interes');
    expect(route).toBeTruthy();
  });
});
