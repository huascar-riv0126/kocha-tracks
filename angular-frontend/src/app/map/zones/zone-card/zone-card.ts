import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { GetStringsPipe } from '../../../core/strings/get-strings-pipe';
import { Zone } from '../zone.model';

@Component({
  selector: 'app-zone-card',
  standalone: true,
  imports: [NgClass, GetStringsPipe],
  templateUrl: './zone-card.html',
})
export class ZoneCard {
  readonly zone = input.required<Zone>();
  readonly selected = input<boolean>(false);
  readonly editing = input<boolean>(false);

  readonly zoneSelected = output<Zone>();
  readonly editZone = output<Zone>();
  readonly deleteZone = output<Zone>();

  readonly hasEvents = computed(() => this.zone().activeEventsCount > 0);

  readonly formattedRadius = computed(() => {
    const meters = this.zone().radiusMeters ?? 0;
    return `${(meters / 1000).toFixed(1)} km`;
  });

  onSelect(): void {
    this.zoneSelected.emit(this.zone());
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.editZone.emit(this.zone());
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.deleteZone.emit(this.zone());
  }
}
