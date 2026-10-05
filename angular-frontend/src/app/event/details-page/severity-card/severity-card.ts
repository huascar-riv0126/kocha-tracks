import { Component, computed, input } from '@angular/core';
import { GetStringsPipe } from '../../../core/strings/get-strings-pipe';

export type Severity = 'low' | 'mid' | 'high';

const SEVERITY_CONFIG: Record<Severity, { percent: number; fill: string }> = {
  low:  { percent: 4, fill: 'bg-status-success-400' },
  mid: { percent: 50, fill: 'bg-accent-warning-400' },
  high:  { percent: 100, fill: 'bg-status-danger-400' },
};

@Component({
  imports: [GetStringsPipe],
  selector: 'app-severity-card',
  templateUrl: './severity-card.html',
})
export class SeverityCard {
  labels = [
    { key: 'low',  text: 'severity.low',  color: 'text-status-success-400' },
    { key: 'mid', text: 'severity.mid', color: 'text-accent-warning-400' },
    { key: 'high',  text: 'severity.high',  color: 'text-status-danger-400' },
  ] as const;

  severity = input.required<Severity>();
  config = computed(() => SEVERITY_CONFIG[this.severity()]);
  fillWidth = computed(() => `${this.config().percent}%`);
}
