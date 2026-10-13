import { Component, input, output } from '@angular/core';
import { ZoneCard } from '../zone-card/zone-card';
import { GetStringsPipe } from '../../../core/strings/get-strings-pipe';
import { Zone } from '../zone.model';

@Component({
  selector: 'app-zones-list',
  standalone: true,
  imports: [ZoneCard, GetStringsPipe],
  templateUrl: './zones-list.html',
})
export class ZonesList {
  readonly zones = input.required<Zone[]>();
  readonly selectedId = input<number | null>(null);
  readonly editingId = input<number | null>(null);

  readonly zoneSelected = output<Zone>();
  readonly createNew = output<void>();
  readonly editZone = output<Zone>();
  readonly deleteZone = output<Zone>();

  onSelect(zone: Zone): void {
    this.zoneSelected.emit(zone);
  }
}
