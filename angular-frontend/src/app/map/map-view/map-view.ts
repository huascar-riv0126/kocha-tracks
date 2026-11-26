import {
  AfterViewInit,
  Component,
  effect,
  Inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  ViewContainerRef,
  type ComponentRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import type * as Leaflet from 'leaflet';
import { EventMockService } from '../../event/event-mock';
import { EventMock } from '../../event/event-mock.model';
import type { LatLng, ZoneMapOverlay } from '../zones/zone.model';
import { SidebarReportsComponent } from './components/sidebar-reports/sidebar-reports';
import { MarkerPopupComponent } from './components/marker-popup/marker-popup';
import { ZoneUndoButtonComponent } from './components/zone-undo-button/zone-undo-button';

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
  imports: [
    CommonModule,
    SidebarReportsComponent,
    MarkerPopupComponent,
    ZoneUndoButtonComponent,
  ],
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
  private popupRefs: Map<number, ComponentRef<MarkerPopupComponent>> = new Map();
  private undoRef?: ComponentRef<ZoneUndoButtonComponent>;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router,
    private eventMockService: EventMockService,
    private vcRef: ViewContainerRef,
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

    if (this.destroyed) return;

    const host = document.getElementById(this.mapId());
    if (!host) return;

    this.map?.remove();
    this.map = undefined;
    this.markersMap.clear();
    this.zoneLayer = undefined;
    this.undoPopup = undefined;
    this.closeUndoPopup();

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

    this.closeUndoPopup();

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
      .openOn(this.map);

    this.undoPopup = popup;

    const ref = this.vcRef.createComponent(ZoneUndoButtonComponent);
    ref.instance.undo.subscribe(() => this.undoPoint.emit());
    this.undoRef = ref;

    popup.setContent(ref.location.nativeElement);
    popup.update();
  }

  private closeUndoPopup(): void {
    this.undoPopup?.close();
    this.undoPopup = undefined;
    this.undoRef?.destroy();
    this.undoRef = undefined;
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

      const ref = this.vcRef.createComponent(MarkerPopupComponent);
      ref.setInput('event', event);
      ref.instance.details.subscribe((id) => {
        this.router.navigate(['/evento', id, 'detalles']);
      });
      this.popupRefs.set(event.id, ref);

      marker.bindPopup(ref.location.nativeElement, {
        className: 'kocha-dark-tooltip',
        closeButton: true,
        offset: [0, -10],
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
    this.closeUndoPopup();
    this.popupRefs.forEach((ref) => ref.destroy());
    this.popupRefs.clear();
    this.zoneLayer?.clearLayers();
    this.zoneLayer = undefined;
    this.leaflet = undefined;
    this.markersMap.clear();
    this.map?.remove();
    this.map = undefined;
  }
}
