import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ZonesPage } from './zones-page';
import { ZonesList } from '../zones-list/zones-list';
import { ZoneConfig } from '../zone-config/zone-config';
import { ZoneCard } from '../zone-card/zone-card';
import { StringsService } from '../../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { routes } from '../../../app.routes';
import { ZONES_MOCK } from '../zones-mock';

vi.mock('leaflet', () => ({
  map: vi.fn(() => ({
    setView: vi.fn().mockReturnThis(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
  })),
  tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
  circleMarker: vi.fn(() => ({
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
  })),
}));

describe('ZonesPage', () => {
  let component: ZonesPage;
  let fixture: ComponentFixture<ZonesPage>;

  beforeEach(async () => {
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

  it('should render list, config and map', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(fixture.debugElement.query(By.directive(ZonesList))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZoneConfig))).toBeTruthy();
    expect(el.querySelector('[data-testid="map-canvas"]')?.getAttribute('id')).toBe(
      'zones-map',
    );
  });

  it('should start with the mock zones and first zone editing', () => {
    expect(component.zones()).toHaveLength(ZONES_MOCK.length);
    expect(component.editingZone()?.id).toBe(1);
    const cards = fixture.debugElement.queryAll(By.directive(ZoneCard));
    expect(cards).toHaveLength(ZONES_MOCK.length);
    const nameInput = fixture.nativeElement.querySelector(
      '[data-testid="zone-config-name"]',
    ) as HTMLInputElement;
    expect(nameInput.value).toBe('Mi casa - Zona Norte');
  });

  it('should update selection when a zone is selected', () => {
    component.onZoneSelected(ZONES_MOCK[1]);
    expect(component.selectedId()).toBe(2);
  });

  it('should switch to create mode on createNew', () => {
    component.onCreateNew();
    expect(component.selectedId()).toBeNull();
    expect(component.editingId()).toBeNull();
    expect(component.editingZone()).toBeNull();
  });

  it('should set editing zone on edit', () => {
    component.onEditZone(ZONES_MOCK[2]);
    expect(component.editingId()).toBe(3);
    expect(component.selectedId()).toBe(3);
  });

  it('should remove the zone on delete', () => {
    component.onDeleteZone(ZONES_MOCK[0]);
    expect(component.zones().find((zone) => zone.id === 1)).toBeUndefined();
    expect(component.selectedId()).toBeNull();
    expect(component.editingId()).toBeNull();
  });

  it('should update the zone name on save in edit mode', () => {
    component.onSave({ name: 'Casa nueva', type: 'radio', radiusMeters: 2000, center: null });
    expect(component.zones()[0].name).toBe('Casa nueva');
    expect(component.zones()[0].radiusMeters).toBe(2000);
  });

  it('should append a zone on save in create mode', () => {
    component.onCreateNew();
    component.onSave({ name: 'Nueva zona', type: 'radio', radiusMeters: 500, center: null });
    expect(component.zones()).toHaveLength(ZONES_MOCK.length + 1);
    const created = component.zones()[component.zones().length - 1];
    expect(created.activeEventsCount).toBe(0);
    expect(component.selectedId()).toBe(created.id);
  });

  it('should restore editing selection on cancel', () => {
    component.onCreateNew();
    component.onCancel();
    expect(component.editingId()).toBe(component.selectedId());
  });

  it('should expose the zonas-interes route', () => {
    const route = routes.find((item) => item.path === 'zonas-interes');
    expect(route).toBeTruthy();
  });
});
