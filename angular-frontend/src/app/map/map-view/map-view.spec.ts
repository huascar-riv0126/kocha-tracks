import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { COCHABAMBA_CENTER, COCHABAMBA_ZOOM, MapView, OSM_TILE_URL } from './map-view';
import { EventMockService } from '../../event/event-mock';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../core/strings/strings-token';
import * as L from 'leaflet';

const {
  mapMock,
  markerMock,
  popupMock,
  leafletApi,
  leafletModule,
  getPopupElement,
  resetLeafletMock,
} = vi.hoisted(() => {
  let popupElement: HTMLElement | undefined;

  const markerMock = {
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    openPopup: vi.fn(),
  };

  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
    on: vi.fn(),
  };

  const popupMock = {
    setLatLng: vi.fn().mockReturnThis(),
    setContent: vi.fn().mockReturnThis(),
    openOn: vi.fn().mockReturnThis(),
    close: vi.fn(),
    getElement: vi.fn(() => {
      if (!popupElement) {
        popupElement = document.createElement('div');
        popupElement.innerHTML = '<button class="zone-undo-btn">Deshacer</button>';
      }
      return popupElement;
    }),
  };

  const zoneLayerMock = {
    addTo: vi.fn().mockReturnThis(),
    clearLayers: vi.fn(),
  };

  const layerMock = () => ({ addTo: vi.fn().mockReturnThis() });

  const leafletApi = {
    map: vi.fn(() => mapMock),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    circleMarker: vi.fn(() => markerMock),
    circle: vi.fn(layerMock),
    polygon: vi.fn(layerMock),
    polyline: vi.fn(layerMock),
    layerGroup: vi.fn(() => zoneLayerMock),
    popup: vi.fn(() => popupMock),
  };

  const leafletModule = Object.assign({}, leafletApi, { default: leafletApi });

  return {
    mapMock,
    markerMock,
    popupMock,
    leafletApi,
    leafletModule,
    getPopupElement: () => popupElement,
    resetLeafletMock: () => {
      popupElement = undefined;
    },
  };
});

vi.mock('leaflet', () => leafletModule);

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
    resetLeafletMock();

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
    const canvas: HTMLElement | null = fixture.nativeElement.querySelector(
      '[data-testid="map-canvas"]',
    );
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

  it('should apply embedded class when embedded input is true', () => {
    fixture.componentRef.setInput('embedded', true);
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('.map-page');
    expect(section.classList.contains('embedded')).toBe(true);
  });

  it('should draw a radio zone as a circle with its radius', async () => {
    fixture.componentRef.setInput('zoneOverlays', [
      { id: 1, type: 'radio', center: [-17.38, -66.15], radiusMeters: 1000 },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(leafletApi.circle).toHaveBeenCalledWith(
      [-17.38, -66.15],
      expect.objectContaining({ radius: 1000 }),
    );
  });

  it('should draw a closed polygon when there are 3 or more points', async () => {
    const triangle = [
      [-17.3895, -66.1568],
      [-17.39, -66.157],
      [-17.389, -66.155],
    ];
    fixture.componentRef.setInput('zoneOverlays', [{ id: 2, type: 'polygon', points: triangle }]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(leafletApi.polygon).toHaveBeenCalledWith(triangle, expect.anything());
  });

  it('should draw a polyline while the polygon has fewer than 3 points', async () => {
    const points = [
      [-17.3895, -66.1568],
      [-17.39, -66.157],
    ];
    fixture.componentRef.setInput('zoneOverlays', [
      { id: 'draft', type: 'polygon', points, draft: true },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(leafletApi.polyline).toHaveBeenCalledWith(points, expect.anything());
    expect(leafletApi.polygon).not.toHaveBeenCalled();
  });

  it('should emit map clicks only when zone interaction is enabled', () => {
    const clickCall = mapMock.on.mock.calls.find(([name]) => name === 'click');
    const handler = clickCall![1];
    const emitSpy = vi.spyOn(component.mapClick, 'emit');

    handler({ latlng: { lat: -17.4, lng: -66.1 } });
    expect(emitSpy).not.toHaveBeenCalled();

    fixture.componentRef.setInput('zoneInteractive', true);
    fixture.detectChanges();

    handler({ latlng: { lat: -17.4, lng: -66.1 } });
    expect(emitSpy).toHaveBeenCalledWith([-17.4, -66.1]);
  });

  it('should show an undo popup on the last draft point and emit undoPoint', async () => {
    fixture.componentRef.setInput('zoneInteractive', true);
    fixture.componentRef.setInput('zoneOverlays', [
      {
        id: 'draft',
        type: 'polygon',
        points: [
          [-17.3895, -66.1568],
          [-17.39, -66.157],
        ],
        draft: true,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(popupMock.setLatLng).toHaveBeenCalledWith([-17.39, -66.157]);

    const emitSpy = vi.spyOn(component.undoPoint, 'emit');
    getPopupElement()?.querySelector<HTMLButtonElement>('.zone-undo-btn')?.click();

    expect(emitSpy).toHaveBeenCalled();
  });
});
