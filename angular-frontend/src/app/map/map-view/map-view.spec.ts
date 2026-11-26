import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { COCHABAMBA_CENTER, COCHABAMBA_ZOOM, MapView, OSM_TILE_URL } from './map-view';
import { EventMockService } from '../../event/event-mock';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../core/strings/strings-token';
import * as L from 'leaflet';

const { mapMock, markerMock, leafletApi, leafletModule } = vi.hoisted(() => {
  const markerMock = {
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    setLatLng: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  };
  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
    on: vi.fn().mockReturnThis(),
  };
  const leafletApi = {
    map: vi.fn(() => mapMock),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    circleMarker: vi.fn(() => markerMock),
  };

  const leafletModule = Object.assign({}, leafletApi, { default: leafletApi });

  return { mapMock, markerMock, leafletApi, leafletModule };
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

  it('should apply embedded class when embedded input is true', () => {
    fixture.componentRef.setInput('embedded', true);
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('.map-page');
    expect(section.classList.contains('embedded')).toBe(true);
  });
});

describe('MapView - selección de ubicación (UH-55)', () => {
  let component: MapView;
  let fixture: ComponentFixture<MapView>;

  const eventServiceMock = {
    getEvents: () => [{ id: 1, title: 'Evento 1', state: 'activo', coordinates: [-17.38, -66.15] }],
  };

  const createMap = async (inputs: Record<string, unknown> = {}) => {
    fixture = TestBed.createComponent(MapView);
    component = fixture.componentInstance;
    Object.entries(inputs).forEach(([key, value]) => fixture.componentRef.setInput(key, value));
    fixture.detectChanges();
    await vi.waitFor(() => expect(L.map).toHaveBeenCalled());
  };

  const clickMap = (lat: number, lng: number) => {
    const clickCall = mapMock.on.mock.calls.find(([name]) => name === 'click');
    const handler = clickCall![1] as (event: { latlng: { lat: number; lng: number } }) => void;
    handler({ latlng: { lat, lng } });
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
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should keep rendering event markers by default', async () => {
    await createMap();
    expect(L.circleMarker).toHaveBeenCalledTimes(1);
  });

  it('should not listen to map clicks when selection is not used', async () => {
    await createMap();
    expect(mapMock.on).not.toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('should render event markers when the router sets showEvents to undefined (/map)', async () => {
    await createMap({ showEvents: undefined });
    expect(L.circleMarker).toHaveBeenCalledTimes(1);
  });

  it('should not render event markers when showEvents is false', async () => {
    await createMap({ showEvents: false });
    expect(L.circleMarker).not.toHaveBeenCalled();
  });

  it('should emit the clicked coordinates when selectable is true', async () => {
    await createMap({ showEvents: false, selectable: true });
    const emitted: unknown[] = [];
    component.locationSelect.subscribe((point) => emitted.push(point));

    clickMap(-17.4, -66.1);

    expect(emitted).toEqual([[-17.4, -66.1]]);
  });

  it('should stop emitting coordinates when selectable is turned off', async () => {
    await createMap({ showEvents: false, selectable: true });
    const emitted: unknown[] = [];
    component.locationSelect.subscribe((point) => emitted.push(point));

    fixture.componentRef.setInput('selectable', false);
    fixture.detectChanges();
    clickMap(-17.4, -66.1);

    expect(emitted).toEqual([]);
  });

  it('should start listening to clicks when selectable is turned on later', async () => {
    await createMap({ showEvents: false });
    expect(mapMock.on).not.toHaveBeenCalledWith('click', expect.any(Function));

    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();
    const emitted: unknown[] = [];
    component.locationSelect.subscribe((point) => emitted.push(point));
    clickMap(-17.42, -66.13);

    expect(mapMock.on).toHaveBeenCalledTimes(1);
    expect(emitted).toEqual([[-17.42, -66.13]]);
  });

  it('should draw, move and remove the selected location marker', async () => {
    await createMap({ showEvents: false, selectedLocation: [-17.4, -66.1] });
    expect(L.circleMarker).toHaveBeenCalledWith(
      [-17.4, -66.1],
      expect.objectContaining({ className: 'selected-location-marker' }),
    );

    fixture.componentRef.setInput('selectedLocation', [-17.41, -66.12]);
    fixture.detectChanges();
    expect(markerMock.setLatLng).toHaveBeenCalledWith([-17.41, -66.12]);

    fixture.componentRef.setInput('selectedLocation', null);
    fixture.detectChanges();
    expect(markerMock.remove).toHaveBeenCalled();
  });

  it('should show the selection cursor only while selectable is true', async () => {
    await createMap({ showEvents: false, selectable: true });
    const canvas: HTMLElement = fixture.nativeElement.querySelector('[data-testid="map-canvas"]');
    expect(canvas.classList.contains('map-selectable')).toBe(true);

    fixture.componentRef.setInput('selectable', false);
    fixture.detectChanges();
    expect(canvas.classList.contains('map-selectable')).toBe(false);
  });
});
