import { AfterViewInit, Component, Inject, input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import type * as Leaflet from 'leaflet';
import { EventMockService } from '../../event/event-mock'; // <-- Importamos tu servicio

// HU-6: mapa base de Cochabamba sin rastreo de ubicacion.
export const COCHABAMBA_CENTER: [number, number] = [-17.3895, -66.1568];
export const COCHABAMBA_ZOOM = 14;
export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.html',
  styleUrl: './map-view.css',
})
export class MapView implements AfterViewInit, OnDestroy {
  readonly mapId = input<string>('map');
  readonly embedded = input<boolean>(false);
  private map?: Leaflet.Map;
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router,                      
    private eventMockService: EventMockService   // <-- UH-5
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }
    const L = await import('leaflet');
    const existing = this.map;
    if (existing) {
      existing.remove();
      this.map = undefined;
    }
    const mapHostId = this.mapId();
    const host = document.getElementById(mapHostId);
    if (host && (host as HTMLElement & { _leaflet_id?: unknown })._leaflet_id !== undefined) {
      host.innerHTML = '';
      delete (host as HTMLElement & { _leaflet_id?: unknown })._leaflet_id;
    }
    const map = L.map(mapHostId, { zoomControl: true, attributionControl: true });
    map.setView(COCHABAMBA_CENTER, COCHABAMBA_ZOOM);
    L.tileLayer(OSM_TILE_URL, { maxZoom: 19, attribution: OSM_ATTRIBUTION }).addTo(map);
    map.invalidateSize();
    this.map = map;

    // Llamamos al renderizado de marcadores (UH-8)
    this.renderMarkers(L, map);
  }

  // Método dedicado a la UH-8
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
        className: 'no-outline-marker' // Clase para quitar el borde feo
      }).addTo(map);

      // Diseño del globo interactivo
      const popupContent = `
        <div style="text-align: center; font-family: sans-serif; min-width: 160px; margin: -5px;">
          <h4 style="margin: 0 0 5px 0; color: #ffffff; font-size: 14px;">${event.title}</h4>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: ${markerColor}; font-weight: bold;">
            Estado: ${event.state.toUpperCase()}
          </p>
          <button 
            class="btn-detalles" 
            style="background-color: #f97316; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; width: 100%;">
            Clic para ver detalles
          </button>
        </div>
      `;

      // Bindeamos como Popup (se queda fijo al hacer clic)
      marker.bindPopup(popupContent, {
        className: 'kocha-dark-tooltip', // Reutilizamos tu excelente CSS oscuro
        closeButton: false, // Ocultamos la X por defecto para un look más limpio
        offset: [0, -5]
      });

      // Abrir el popup temporalmente al pasar el mouse (Hover)
          marker.on('mouseover', () => {
            marker.openPopup();
          });

      // Magia: Escuchar el clic EN EL BOTÓN NARANJA dentro del popup
      marker.on('popupopen', (e) => {
        const popupNode = e.popup.getElement();
        if (popupNode) {
          const btn = popupNode.querySelector('.btn-detalles');
          if (btn) {
            // Removemos listeners previos para evitar ejecuciones dobles
            const newBtn = btn.cloneNode(true);
            btn.parentNode?.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
              this.router.navigate(['/event-details', event.id]);
            });
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
  }
}