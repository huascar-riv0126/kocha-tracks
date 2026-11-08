import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { EventChange } from './event-change.model';
import { EventChangeRow } from './event-change-row/event-change-row';

@Component({
  selector: 'app-event-history',
  imports: [EventChangeRow, TranslocoPipe],
  templateUrl: './event-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventHistory {
  readonly changes = input.required<readonly EventChange[]>();
  protected readonly ascending = signal(false);
  protected readonly sortedChanges = computed(() => {
    const direction = this.ascending() ? 1 : -1;
    return [...this.changes()].sort(
      (a, b) => direction * (a.occurredAt.getTime() - b.occurredAt.getTime()),
    );
  });

  protected toggleOrder(): void {
    this.ascending.update((value) => !value);
  }
}
