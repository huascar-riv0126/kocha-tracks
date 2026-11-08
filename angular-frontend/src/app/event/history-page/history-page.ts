import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { pendingUntilEvent, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EventMock } from '../event-mock.model';
import { EventHistory } from '../event-history/event-history';
import { EventChange } from '../event-history/event-change.model';
import { HistoryEventCard } from './history-event-card/history-event-card';
import { HistorySourcesCard } from './history-sources-card/history-sources-card';
import { HistoryHelpCard } from './history-help-card/history-help-card';
import { getEventHistoryExample } from './history-page.mock';

@Component({
  selector: 'app-event-history-page',
  imports: [
    EventHistory,
    HistoryEventCard,
    HistorySourcesCard,
    HistoryHelpCard,
    RouterLink,
    TranslocoPipe,
  ],
  templateUrl: './history-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventHistoryPage {
  readonly event = input.required<EventMock>();
  private readonly transloco = inject(TranslocoService);
  // SSR must wait for the initial dictionary, including native filesystem-based loading.
  private readonly translations = toSignal(
    this.transloco.selectTranslation().pipe(pendingUntilEvent()),
  );
  protected readonly example = computed(() => getEventHistoryExample(this.event().id));
  protected readonly changes = computed<readonly EventChange[]>(() => {
    // Rebuild presentation text only after the current language has finished loading.
    if (!this.translations()) return [];

    return this.example().changes.map((change) => ({
      id: change.id,
      version: change.version,
      occurredAt: change.occurredAt,
      type: change.type,
      title: this.transloco.translate<string>(change.titleKey),
      field: this.transloco.translate<string>(change.fieldKey),
      before: this.transloco.translate<string>(change.beforeKey),
      after: this.transloco.translate<string>(change.afterKey),
      description: this.transloco.translate<string>(change.descriptionKey),
      isExample: true,
    }));
  });
}
