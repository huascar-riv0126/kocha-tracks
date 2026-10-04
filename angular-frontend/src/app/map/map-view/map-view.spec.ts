import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as L from 'leaflet';
import { COCHABAMBA_CENTER, COCHABAMBA_ZOOM, MapView, OSM_TILE_URL } from './map-view';
import { EventMockService } from '../../event/event-mock';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../core/strings/strings-token';

const { mapMock, markerMock } = vi.hoisted(() => {
  const markerMock = {
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
  };
  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
  };
  return { mapMock, markerMock };
});

vi.mock('leaflet', () => ({
  map: vi.fn(() => mapMock),
  tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
  circleMarker: vi.fn(() => markerMock),
}));

describe('MapView', () => {
  let component: MapView;
  let fixture: ComponentFixture<MapView>;

  const eventServiceMock = {
    getEvents: () => [
      { id: 1, title: 'Evento 1', state: 'activo', coordinates: [-17.38, -66.15] },
      { id: 2, title: 'Evento 2', state: 'finalizado', coordinates: [-17.39, -66.16] },
    ],
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MapView],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: EventMockService, useValue: eventServiceMock },
        StringsService,
        {
          provide: STRINGS_LOADER,
          useValue: { load: () => Promise.resolve({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapView);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Espera a que termine el ngAfterViewInit asíncrono (import dinámico)
    await vi.waitFor(() => expect(L.map).toHaveBeenCalled());
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the map canvas for Leaflet tiles', () => {
    const canvas: HTMLElement | null =
      fixture.nativeElement.querySelector('[data-testid="map-canvas"]');
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute('id')).toBe('map');
  });

  it('should initialize the map centered on Cochabamba', () => {
    expect(mapMock.setView).toHaveBeenCalledWith(COCHABAMBA_CENTER, COCHABAMBA_ZOOM);
    expect(L.tileLayer).toHaveBeenCalledWith(
      OSM_TILE_URL,
      expect.objectContaining({ maxZoom: 19 }),
    );
  });

  it('should render one marker per event with the right color', () => {
    expect(L.circleMarker).toHaveBeenCalledTimes(2);
    expect(L.circleMarker).toHaveBeenNthCalledWith(
      1,
      [-17.38, -66.15],
      expect.objectContaining({ fillColor: '#ef4444' }), // activo
    );
    expect(L.circleMarker).toHaveBeenNthCalledWith(
      2,
      [-17.39, -66.16],
      expect.objectContaining({ fillColor: '#22c55e' }), // otro estado
    );
  });

  it('should remove the map on destroy', () => {
    fixture.destroy();
    expect(mapMock.remove).toHaveBeenCalled();
  });

  it('should expose no GPS tracking API', () => {
    expect('geolocation' in component).toBe(false);
    expect('locate' in component).toBe(false);
  });

  it('should navigate to event details when popup button is clicked', () => {
    const router = TestBed.inject(Router);

    // Buscamos el callback registrado para 'popupopen' en el primer marcador
    const popupOpenCall = markerMock.on.mock.calls.find(([name]) => name === 'popupopen');
    const handler = popupOpenCall![1];

    const popupEl = document.createElement('div');
    popupEl.innerHTML = '<button class="btn-detalles">Ver</button>';
    handler({ popup: { getElement: () => popupEl } });

    popupEl.querySelector<HTMLButtonElement>('.btn-detalles')!.click();
  
    expect(router.navigate).toHaveBeenCalledWith(['/evento', 1, 'detalles']);
  });
});