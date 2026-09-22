import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { COCHABAMBA_CENTER, COCHABAMBA_ZOOM, MapView, OSM_TILE_URL } from './map-view';
import { EventMockService } from '../../event/event-mock';

describe('MapView', () => {
  let component: MapView;
  let fixture: ComponentFixture<MapView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapView],
      providers: [
        EventMockService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the map canvas for Leaflet tiles', () => {
    const canvas: HTMLElement | null = fixture.nativeElement.querySelector('[data-testid="map-canvas"]');
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute('id')).toBe('map');
  });

  it('should target Cochabamba with zoom for ~40 blocks radius and OSM tiles', () => {
    expect(COCHABAMBA_CENTER).toEqual([-17.3895, -66.1568]);
    expect(COCHABAMBA_ZOOM).toBe(14);
    expect(OSM_TILE_URL).toContain('tile.openstreetmap.org');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should expose no GPS tracking API', () => {
    expect('geolocation' in component).toBe(false);
    expect('locate' in component).toBe(false);
  });
});