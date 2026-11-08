import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { Source } from '../../../sources-page/source-model';

export type HistorySource = Pick<Source, 'id' | 'name' | 'url'>;

@Component({
  selector: 'app-history-sources-card',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './history-sources-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class HistorySourcesCard {
  readonly eventId = input.required<number>();
  readonly sources = input.required<readonly HistorySource[]>();
}
