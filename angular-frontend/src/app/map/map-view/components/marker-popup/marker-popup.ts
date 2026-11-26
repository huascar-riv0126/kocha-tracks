import { Component, computed, input, output } from '@angular/core';
import { GetStringsPipe } from '../../../../core/strings/get-strings-pipe';
import { EventMock } from '../../../../event/event-mock.model';

@Component({
  selector: 'app-marker-popup',
  standalone: true,
  imports: [GetStringsPipe],
  templateUrl: './marker-popup.html',
})
export class MarkerPopupComponent {
  readonly event = input.required<EventMock>();
  readonly details = output<number>();

  readonly markerColor = computed(
    () => (this.event().state === 'activo' ? '#ef4444' : '#22c55e'),
  );
}
