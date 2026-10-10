import { AfterViewInit, Component, Inject, input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import type * as Leaflet from 'leaflet';
import { EventMockService } from '../../event/event-mock';
import { EventMock } from '../../event/event-mock.model';
import { SidebarReportsComponent } from './components/sidebar-reports/sidebar-reports';

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
  private map?: Leaflet.Map;
  private readonly isBrowser: boolean;
  private destroyed = false;
  
private markersMap: Map<number, Leaflet.CircleMarker> = new Map();

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router,
    private eventMockService: EventMockService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
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

    this.renderMarkers(L, map);
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
    this.markersMap.clear();
    this.map?.remove();
    this.map = undefined;
  }
}