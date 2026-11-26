import { AfterViewInit, Component, effect, Inject, input, OnDestroy, output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import type * as Leaflet from 'leaflet';
import { EventMockService } from '../../event/event-mock';
import { EventMock } from '../../event/event-mock.model';
import { SidebarReportsComponent } from './components/sidebar-reports/sidebar-reports';
import { LatLng } from '../zones/zone.model';

export const COCHABAMBA_CENTER: [number, number] = [-17.3895, -66.1568];
export const COCHABAMBA_ZOOM = 14;
export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, SidebarReportsComponent],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css',
})
export class MapView implements AfterViewInit, OnDestroy {
  readonly mapId = input<string>('map');
  readonly embedded = input<boolean>(false);
  /**
   * Muestra los marcadores de eventos. Por defecto se mantienen como antes.
   * Cuando el mapa es la página de una ruta (/map), el router asigna `undefined`
   * a las entradas que no vienen en la URL; en ese caso también se muestran.
   */
  readonly showEvents = input<boolean, boolean | undefined>(true, {
    transform: (value: boolean | undefined) => value ?? true,
  });
  /** UH-55: permite elegir un punto haciendo clic en el mapa. */
  readonly selectable = input<boolean>(false);
  /** UH-55: punto seleccionado que se marca en el mapa. */
  readonly selectedLocation = input<LatLng | null>(null);
  /** UH-55: emite las coordenadas del clic cuando `selectable` está activo. */
  readonly locationSelect = output<LatLng>();
  private map?: Leaflet.Map;
  private leaflet?: typeof Leaflet;
  private selectionMarker?: Leaflet.CircleMarker;
  private selectionClickEnabled = false;
  private readonly isBrowser: boolean;
  private destroyed = false;
  private resizeObserver?: ResizeObserver;
  private markersMap: Map<number, Leaflet.CircleMarker> = new Map();

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router,
    private eventMockService: EventMockService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(() => this.syncSelectionMarker(this.selectedLocation()));
    effect(() => this.syncSelectableCursor(this.selectable()));
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    const leafletModule = await import('leaflet');
    const L = ((leafletModule as any).default ?? leafletModule) as typeof Leaflet;

    // El componente pudo destruirse mientras cargaba Leaflet
    if (this.destroyed) return;

    const host = document.getElementById(this.mapId());
    if (!host) return;

    this.map?.remove();
    this.map = undefined;
    this.markersMap.clear();

    if ((host as HTMLElement & { _leaflet_id?: unknown })._leaflet_id !== undefined) {
      host.innerHTML = '';
      delete (host as HTMLElement & { _leaflet_id?: unknown })._leaflet_id;
    }

    const map = L.map(host, { zoomControl: true, attributionControl: true });
    map.setView(COCHABAMBA_CENTER, COCHABAMBA_ZOOM);
    L.tileLayer(OSM_TILE_URL, { maxZoom: 19, attribution: OSM_ATTRIBUTION }).addTo(map);
    map.invalidateSize();
    this.map = map;
    this.leaflet = L;

    // El slot flex puede crecer tras el init (ej. Zonas): revalidar tamaño
    // para que Leaflet pinte tiles hasta abajo y no quede franja en blanco.
    window.setTimeout(() => map.invalidateSize(), 100);
    window.setTimeout(() => map.invalidateSize(), 500);
    if (typeof ResizeObserver !== 'undefined') {
      let scheduled = false;
      this.resizeObserver = new ResizeObserver(() => {
        if (scheduled || this.destroyed) return;
        scheduled = true;
        window.requestAnimationFrame(() => {
          scheduled = false;
          if (!this.destroyed) map.invalidateSize();
        });
      });
      this.resizeObserver.observe(host);
    }

    if (this.showEvents()) {
      this.renderMarkers(L, map);
    }

    this.syncSelectionMarker(this.selectedLocation());
    this.syncSelectableCursor(this.selectable());
  }

  /** UH-55: crea, mueve o quita el marcador del punto seleccionado. */
  private syncSelectionMarker(location: LatLng | null): void {
    const L = this.leaflet;
    const map = this.map;
    if (!L || !map) return;

    if (!location) {
      this.selectionMarker?.remove();
      this.selectionMarker = undefined;
      return;
    }

    if (this.selectionMarker) {
      this.selectionMarker.setLatLng(location);
      return;
    }

    this.selectionMarker = L.circleMarker(location, {
      radius: 10,
      weight: 3,
      opacity: 1,
      fillOpacity: 1,
      className: 'selected-location-marker',
    }).addTo(map);
  }

  /** UH-55: muestra el cursor de selección y escucha clics mientras se puede elegir un punto. */
  private syncSelectableCursor(selectable: boolean): void {
    if (!this.isBrowser) return;
    document.getElementById(this.mapId())?.classList.toggle('map-selectable', selectable);
    if (selectable) this.enableSelectionClick();
  }

  /**
   * UH-55: el mapa solo escucha clics cuando alguna página activa la selección,
   * así las páginas que no la usan (/map, Zonas, landing) se comportan igual que antes.
   */
  private enableSelectionClick(): void {
    const map = this.map;
    if (!map || this.selectionClickEnabled) return;
    this.selectionClickEnabled = true;
    map.on('click', (event: Leaflet.LeafletMouseEvent) => {
      if (!this.selectable()) return;
      this.locationSelect.emit([event.latlng.lat, event.latlng.lng]);
    });
  }

  private renderMarkers(L: typeof Leaflet, map: Leaflet.Map): void {
    const events = this.eventMockService.getEvents();

    events.forEach(event => {
      const markerColor = event.state === 'activo' ? '#ef4444' : '#22c55e';

      const marker = L.circleMarker(event.coordinates, {
        radius: 10,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
        className: 'no-outline-marker'
      }).addTo(map);
      
      this.markersMap.set(event.id, marker);

      const address = event.location || 'Ubicación no especificada';
      const sourceInfo = event.sourceName || 'Múltiples reportes';

      const popupContent = `
        <div style="text-align: left; font-family: sans-serif; min-width: 240px; padding-right: 15px;">
          <h4 style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px; border-bottom: 1px solid #4b5563; padding-bottom: 8px;">
            ${event.title}
          </h4>
          <div style="font-size: 13px; color: #d1d5db; margin-bottom: 15px; line-height: 1.5;">
            <p style="margin: 5px 0;">
              <span style="color: #9ca3af;">Ubicación:</span><br/>
              <strong>${address}</strong>
            </p>
            <p style="margin: 5px 0;">
              <span style="color: #9ca3af;">Fuentes:</span> 
              ${sourceInfo}
            </p>
            
            <div style="margin: 12px 0 6px 0; display: flex; align-items: center; gap: 8px;">
              <span style="color: #9ca3af;">Estado actual:</span> 
              <span style="background-color: ${markerColor}20; color: ${markerColor}; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; border: 1px solid ${markerColor}50;">
                ${event.state.toUpperCase()}
              </span>
            </div>

          </div>
          <button 
            class="btn-detalles" 
            style="background-color: #f97316; color: white; border: none; padding: 10px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold; width: 100%; transition: background-color 0.2s;">
            Ver información detallada
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'kocha-dark-tooltip',
        closeButton: true,
        offset: [0, -10] 
      });

      marker.on('popupopen', (e) => {
        const popupNode = e.popup.getElement();
        if (popupNode) {
          const btn = popupNode.querySelector('.btn-detalles');
          if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode?.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
              this.router.navigate(['/evento', event.id, 'detalles']);
            });
          }
        }
      });
    });
  }

  onSidebarEventSelect(event: EventMock): void {
    if (this.map) {
      this.map.setView(event.coordinates, 15);
      this.map.invalidateSize();
      
      const marker = this.markersMap.get(event.id);
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 300);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.markersMap.clear();
    this.selectionMarker = undefined;
    this.selectionClickEnabled = false;
    this.map?.remove();
    this.map = undefined;
  }
}