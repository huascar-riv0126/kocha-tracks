import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
//import { isPlatformBrowser } from '@angular/common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import type * as Leaflet from 'leaflet';

// HU-9: Modelo de datos para el evento en el mapa
export interface MapEvent {
  id: number;
  nombre: string;
  ubicacion: string;
  fuentes: string[];
  coordenadas: [number, number];
}
// HU-6: mapa base de Cochabamba sin rastreo de ubicacion.
export const COCHABAMBA_CENTER: [number, number] = [-17.3895, -66.1568];
export const COCHABAMBA_ZOOM = 14;
export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

@Component({
  selector: 'app-map-view',
  standalone: true,
  //+
  imports: [CommonModule],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css',
})
export class MapView implements AfterViewInit, OnDestroy {
  private map?: Leaflet.Map;
  private readonly isBrowser: boolean;

// HU-9: Estado para el modal de evento seleccionado
  selectedEvent: MapEvent | null = null;

  // HU-9: Datos simulados mientras se conectan servicios reales
  mockEvents: MapEvent[] = [
    {
      id: 1,
      nombre: 'Bloqueo en Av. Blanco Galindo',
      ubicacion: 'Av. Blanco Galindo Km 2, Cochabamba',
      fuentes: ['Tránsito Policial', 'Reporte Vecinal'],
      coordenadas: [-17.3938, -66.1735]
    },
    {
      id: 2,
      nombre: 'Mantenimiento Vial Reducto',
      ubicacion: 'Av. Heroínas y Ayacucho, Cochabamba',
      fuentes: ['Alcaldía Cochabamba', 'Prensa Local'],
      coordenadas: [-17.3925, -66.1580]
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
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
    const host = document.getElementById('map');
    if (host && (host as HTMLElement & { _leaflet_id?: unknown })._leaflet_id !== undefined) {
      // Contenedor ya inicializado antes (p. ej. HMR o tests): liberarlo.
      host.innerHTML = '';
      delete (host as HTMLElement & { _leaflet_id?: unknown })._leaflet_id;
    }
    const map = L.map('map', { zoomControl: true, attributionControl: true });
    map.setView(COCHABAMBA_CENTER, COCHABAMBA_ZOOM);
    L.tileLayer(OSM_TILE_URL, { maxZoom: 19, attribution: OSM_ATTRIBUTION }).addTo(map);
	
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    // HU-9: Pines con evento click
    this.mockEvents.forEach(event => {
      const marker = L.marker(event.coordenadas, { icon: defaultIcon }).addTo(map);
      marker.on('click', () => {
        this.selectedEvent = event;
      });
    });

    map.invalidateSize();
    this.map = map;
  }
  
  closeModal(): void {
    this.selectedEvent = null;
  }

  refreshMapSize(): void {
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 50);
  }

  onActionClick(): void {
    alert(`Acción ejecutada para: ${this.selectedEvent?.nombre}`);
    this.closeModal();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
  }
}

