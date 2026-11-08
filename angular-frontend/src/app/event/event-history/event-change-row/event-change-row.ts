import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EventChange } from '../event-change.model';

registerLocaleData(localeEs);

@Component({
  selector: 'app-event-change-row',
  imports: [DatePipe, TranslocoPipe],
  templateUrl: './event-change-row.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class EventChangeRow {
  readonly change = input.required<EventChange>();
  readonly last = input(false);
  protected readonly transloco = inject(TranslocoService);
  protected readonly appearance = computed(() => {
    const styles = {
      started: {
        text: 'text-status-danger-600',
        background: 'bg-status-danger-100',
        icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6 M14 2v6h6 M14 2l6 6v4 M18 16v6 M15 19h6',
      },
      updated: {
        text: 'text-brand-primary-500',
        background: 'bg-brand-primary-50',
        icon: 'M12 8v4h4 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
      },
      finished: {
        text: 'text-status-success-600',
        background: 'bg-status-success-100',
        icon: 'm9 12 2 2 4-4 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
      },
    };
    return styles[this.change().type];
  });
}
