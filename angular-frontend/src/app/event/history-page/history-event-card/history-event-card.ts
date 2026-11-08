import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { EventMock } from '../../event-mock.model';

@Component({
  selector: 'app-history-event-card',
  imports: [DatePipe, TranslocoPipe],
  templateUrl: './history-event-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class HistoryEventCard {
  readonly event = input.required<EventMock>();
}
