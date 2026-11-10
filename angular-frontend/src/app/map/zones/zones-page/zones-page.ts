import { afterNextRender, Component, computed, signal } from '@angular/core';
import { MapView } from '../../map-view/map-view';
import { ZonesList } from '../zones-list/zones-list';
import { ZoneConfig } from '../zone-config/zone-config';
import {
  LatLng,
  Zone,
  ZoneDraft,
  ZoneMapOverlay,
  ZoneType,
  ZONE_RADIUS_DEFAULT,
} from '../zone.model';
import { ZONES_MOCK } from '../zones-mock';
import { loadZones, saveZones } from '../zones-storage';

const INITIAL_ZONE = ZONES_MOCK[0];

@Component({
  selector: 'app-zones-page',
  standalone: true,
  imports: [MapView, ZonesList, ZoneConfig],
  templateUrl: './zones-page.html',
  styleUrl: './zones-page.css',
})
export class ZonesPage {
  readonly zones = signal<Zone[]>(ZONES_MOCK);
  readonly selectedId = signal<number | null>(INITIAL_ZONE.id);
  readonly editingId = signal<number | null>(null);
  readonly creating = signal(false);

  readonly draftType = signal<ZoneType>('radio');
  readonly draftCenter = signal<LatLng | null>(null);
  readonly draftPoints = signal<LatLng[]>([]);
  readonly draftRadius = signal<number>(ZONE_RADIUS_DEFAULT);

  constructor() {
    afterNextRender(() => {
      const stored = loadZones();
      if (!stored) return;

      this.zones.set(stored);
      if (!stored.some((zone) => zone.id === this.selectedId())) {
        this.selectedId.set(stored[0]?.id ?? null);
      }
    });
  }

  readonly editingZone = computed(
    () => this.zones().find((zone) => zone.id === this.editingId()) ?? null,
  );

  readonly selectedZone = computed(
    () => this.zones().find((zone) => zone.id === this.selectedId()) ?? null,
  );

  readonly isDrafting = computed(() => this.creating() || this.editingId() !== null);

  readonly mapOverlays = computed<ZoneMapOverlay[]>(() => {
    if (this.creating()) {
      const draft = this.buildDraftOverlay('draft', true);
      return draft ? [draft] : [];
    }

    const overlays: ZoneMapOverlay[] = [];
    const editing = this.editingZone();

    if (editing) {
      const draft = this.buildDraftOverlay(editing.id, true);
      if (draft) overlays.push(draft);
    }

    const selected = this.selectedZone();
    if (selected && selected.id !== editing?.id) {
      const overlay = this.buildZoneOverlay(selected);
      if (overlay) overlays.push(overlay);
    }

    return overlays;
  });

  onZoneSelected(zone: Zone): void {
    this.selectedId.set(zone.id);
  }

  onCreateNew(): void {
    this.creating.set(true);
    this.selectedId.set(null);
    this.editingId.set(null);
    this.resetDraft();
  }

  onEditZone(zone: Zone): void {
    this.creating.set(false);
    this.selectedId.set(zone.id);
    this.editingId.set(zone.id);
    this.syncDraftFromZone(zone);
  }

  onDeleteZone(zone: Zone): void {
    this.zones.update((zones) => zones.filter((item) => item.id !== zone.id));
    saveZones(this.zones());
    if (this.selectedId() === zone.id) this.selectedId.set(null);
    if (this.editingId() === zone.id) this.editingId.set(null);
  }

  onMapClick(point: LatLng): void {
    if (!this.isDrafting()) return;

    if (this.draftType() === 'radio') {
      this.draftCenter.set(point);
      return;
    }

    this.draftPoints.update((points) => [...points, point]);
  }

  onUndoPoint(): void {
    this.draftPoints.update((points) => points.slice(0, -1));
  }

  onClearPoints(): void {
    this.draftPoints.set([]);
  }

  onRadiusChange(radius: number): void {
    this.draftRadius.set(radius);
  }

  onTypeChange(type: ZoneType): void {
    this.draftType.set(type);
  }

  onSave(draft: ZoneDraft): void {
    const editingId = this.editingId();
    const center = draft.type === 'radio' ? (draft.center ?? undefined) : undefined;
    const geometry = draft.type === 'polygon' ? [...draft.points] : undefined;

    if (editingId !== null) {
      this.zones.update((zones) =>
        zones.map((zone) =>
          zone.id === editingId
            ? {
                ...zone,
                name: draft.name,
                type: draft.type,
                center,
                radiusMeters: draft.type === 'radio' ? draft.radiusMeters : undefined,
                geometry,
              }
            : zone,
        ),
      );
      saveZones(this.zones());
      this.selectedId.set(editingId);
      this.editingId.set(null);
      this.creating.set(false);
      this.resetDraft();
      return;
    }

    const created: Zone = {
      id: this.nextZoneId(),
      name: draft.name,
      type: draft.type,
      center,
      radiusMeters: draft.type === 'radio' ? draft.radiusMeters : undefined,
      geometry,
      activeEventsCount: 0,
    };
    this.zones.update((zones) => [...zones, created]);
    saveZones(this.zones());
    this.selectedId.set(created.id);
    this.editingId.set(null);
    this.creating.set(false);
    this.resetDraft();
  }

  onCancel(): void {
    this.creating.set(false);
    this.editingId.set(null);
    this.resetDraft();
  }

  private syncDraftFromZone(zone: Zone): void {
    this.draftType.set(zone.type);
    this.draftCenter.set(zone.center ?? null);
    this.draftPoints.set(zone.geometry ? [...zone.geometry] : []);
    this.draftRadius.set(zone.radiusMeters ?? ZONE_RADIUS_DEFAULT);
  }

  private resetDraft(): void {
    this.draftType.set('radio');
    this.draftCenter.set(null);
    this.draftPoints.set([]);
    this.draftRadius.set(ZONE_RADIUS_DEFAULT);
  }

  private nextZoneId(): number {
    return this.zones().reduce((max, zone) => Math.max(max, zone.id), 1000) + 1;
  }

  private buildDraftOverlay(id: number | 'draft', draft: boolean): ZoneMapOverlay | null {
    if (this.draftType() === 'radio') {
      const center = this.draftCenter();
      if (!center) return null;
      return {
        id,
        type: 'radio',
        center,
        radiusMeters: this.draftRadius(),
        draft,
      };
    }

    return {
      id,
      type: 'polygon',
      points: [...this.draftPoints()],
      draft,
    };
  }

  private buildZoneOverlay(zone: Zone): ZoneMapOverlay | null {
    if (zone.type === 'radio') {
      if (!zone.center) return null;
      return {
        id: zone.id,
        type: 'radio',
        center: zone.center,
        radiusMeters: zone.radiusMeters ?? ZONE_RADIUS_DEFAULT,
      };
    }

    return {
      id: zone.id,
      type: 'polygon',
      points: zone.geometry ? [...zone.geometry] : [],
    };
  }
}
