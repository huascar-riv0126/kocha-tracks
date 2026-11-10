import {
  AfterViewInit,
  Component,
  effect,
  Inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import type * as Leaflet from 'leaflet';
import { EventMockService } from '../../event/event-mock';
import { EventMock } from '../../event/event-mock.model';
import type { LatLng, ZoneMapOverlay } from '../zones/zone.model';
import { SidebarReportsComponent } from './components/sidebar-reports/sidebar-reports';

export const COCHABAMBA_CENTER: [number, number] = [-17.3895, -66.1568];
export const COCHABAMBA_ZOOM = 14;
export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const ZONE_COLOR = '#f97316';
const ZONE_FILL_COLOR = '#f97316';

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
  readonly zoneOverlays = input<ZoneMapOverlay[]>([]);
  readonly zoneInteractive = input<boolean>(false);

  readonly mapClick = output<LatLng>();
  readonly undoPoint = output<void>();

  private map?: Leaflet.Map;
  private leaflet?: typeof Leaflet;
  private zoneLayer?: Leaflet.LayerGroup;
  private undoPopup?: Leaflet.Popup;
  private readonly isBrowser: boolean;
  private destroyed = false;
  private resizeObserver?: ResizeObserver;
  private markersMap: Map<number, Leaflet.CircleMarker> = new Map();

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router,
    private eventMockService: EventMockService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(() => {
      const overlays = this.zoneOverlays();
      const interactive = this.zoneInteractive();
      if (!this.leaflet || !this.map) return;
      this.renderZoneOverlays(overlays, interactive);
    });
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
    this.zoneLayer = undefined;
    this.undoPopup = undefined;

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

    map.on('click', (event: Leaflet.LeafletMouseEvent) => {
      if (!this.zoneInteractive()) return;
      this.mapClick.emit([event.latlng.lat, event.latlng.lng]);
    });

    this.renderMarkers(L, map);
    this.renderZoneOverlays(this.zoneOverlays(), this.zoneInteractive());
  }

  private renderZoneOverlays(overlays: ZoneMapOverlay[], interactive: boolean): void {
    const L = this.leaflet;
    const map = this.map;
    if (!L || !map) return;

    this.undoPopup?.close();
    this.undoPopup = undefined;

    if (!this.zoneLayer) {
      this.zoneLayer = L.layerGroup().addTo(map);
    }
    this.zoneLayer.clearLayers();

    overlays.forEach((overlay) => {
      if (overlay.type === 'radio') {
        L.circle(overlay.center, {
          radius: overlay.radiusMeters,
          color: ZONE_COLOR,
          weight: 2,
          fillColor: ZONE_FILL_COLOR,
          fillOpacity: 0.18,
        }).addTo(this.zoneLayer!);
        return;
      }

      if (overlay.points.length >= 3) {
        L.polygon(overlay.points, {
          color: ZONE_COLOR,
          weight: 2,
          fillColor: ZONE_FILL_COLOR,
          fillOpacity: 0.18,
        }).addTo(this.zoneLayer!);
      } else if (overlay.points.length === 2) {
        L.polyline(overlay.points, {
          color: ZONE_COLOR,
          weight: 2,
        }).addTo(this.zoneLayer!);
      }

      overlay.points.forEach((point) => {
        L.circleMarker(point, {
          radius: 5,
          color: '#ffffff',
          weight: 2,
          fillColor: ZONE_COLOR,
          fillOpacity: 1,
          bubblingMouseEvents: false,
          className: 'no-outline-marker',
        }).addTo(this.zoneLayer!);
      });

      if (interactive && overlay.draft && overlay.points.length > 0) {
        this.openUndoPopup(overlay.points[overlay.points.length - 1]);
      }
    });
  }

  private openUndoPopup(point: LatLng): void {
    if (!this.leaflet || !this.map) return;

    const popup = this.leaflet
      .popup({
        closeButton: false,
        autoClose: false,
        closeOnClick: false,
        offset: [0, -10],
        className: 'zone-undo-popup',
      })
      .setLatLng(point)
      .setContent(
        `<button type="button" class="zone-undo-btn" style="background-color: #f97316; color: #ffffff; border: none; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 700; cursor: pointer;">Deshacer punto</button>`,
      )
      .openOn(this.map);

    this.undoPopup = popup;

    const element = popup.getElement();
    element
      ?.querySelector('.zone-undo-btn')
      ?.addEventListener('click', () => this.undoPoint.emit());
  }

  private renderMarkers(L: typeof Leaflet, map: Leaflet.Map): void {
    const events = this.eventMockService.getEvents();

    events.forEach((event) => {
      const markerColor = event.state === 'activo' ? '#ef4444' : '#22c55e';

      const marker = L.circleMarker(event.coordinates, {
        radius: 10,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
        className: 'no-outline-marker',
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
        offset: [0, -10],
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
    this.undoPopup?.close();
    this.undoPopup = undefined;
    this.zoneLayer?.clearLayers();
    this.zoneLayer = undefined;
    this.leaflet = undefined;
    this.markersMap.clear();
    this.map?.remove();
    this.map = undefined;
  }
}
