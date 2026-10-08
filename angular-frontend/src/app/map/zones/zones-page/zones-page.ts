import { Component, computed, signal } from '@angular/core';
import { MapView } from '../../map-view/map-view';
import { ZonesList } from '../zones-list/zones-list';
import { ZoneConfig } from '../zone-config/zone-config';
import { Zone, ZoneDraft } from '../zone.model';
import { ZONES_MOCK } from '../zones-mock';

let nextZoneId = 1000;

@Component({
  selector: 'app-zones-page',
  standalone: true,
  imports: [MapView, ZonesList, ZoneConfig],
  templateUrl: './zones-page.html',
  styleUrl: './zones-page.css',
})
export class ZonesPage {
  readonly zones = signal<Zone[]>(ZONES_MOCK);
  readonly selectedId = signal<number | null>(1);
  readonly editingId = signal<number | null>(1);

  readonly editingZone = computed(
    () => this.zones().find((zone) => zone.id === this.editingId()) ?? null,
  );

  onZoneSelected(zone: Zone): void {
    this.selectedId.set(zone.id);
  }

  onCreateNew(): void {
    this.selectedId.set(null);
    this.editingId.set(null);
  }

  onEditZone(zone: Zone): void {
    this.selectedId.set(zone.id);
    this.editingId.set(zone.id);
  }

  onDeleteZone(zone: Zone): void {
    this.zones.update((zones) => zones.filter((item) => item.id !== zone.id));
    if (this.selectedId() === zone.id) this.selectedId.set(null);
    if (this.editingId() === zone.id) this.editingId.set(null);
  }

  onSave(draft: ZoneDraft): void {
    const editingId = this.editingId();
    if (editingId !== null) {
      this.zones.update((zones) =>
        zones.map((zone) =>
          zone.id === editingId
            ? {
                ...zone,
                name: draft.name,
                type: draft.type,
                radiusMeters:
                  draft.type === 'radio' ? draft.radiusMeters : zone.radiusMeters,
              }
            : zone,
        ),
      );
      this.selectedId.set(editingId);
    } else {
      nextZoneId += 1;
      const created: Zone = {
        id: nextZoneId,
        name: draft.name,
        type: draft.type,
        radiusMeters: draft.type === 'radio' ? draft.radiusMeters : undefined,
        activeEventsCount: 0,
      };
      this.zones.update((zones) => [...zones, created]);
      this.selectedId.set(created.id);
      this.editingId.set(created.id);
    }
  }

  onCancel(): void {
    this.editingId.set(this.selectedId());
  }
}
