import { Component, computed, input } from '@angular/core';
import { GetStringsPipe } from '../../../core/strings/get-strings-pipe';

export type Severity = 'low' | 'mid' | 'high';

const SEVERITY_CONFIG: Record<Severity, { percent: number; fill: string }> = {
  low:  { percent: 4, fill: 'bg-[#10B981]' },
  mid: { percent: 50, fill: 'bg-[#F5A54B]' },
  high:  { percent: 100, fill: 'bg-[#EF4444]' },
};

@Component({
  imports: [GetStringsPipe],
  selector: 'app-severity-card',
  templateUrl: './severity-card.html',
})
export class SeverityCard {
  labels = [
    { key: 'low',  text: 'severity.low',  color: 'text-[#10B981]' },
    { key: 'mid', text: 'severity.mid', color: 'text-[#F5A54B]' },
    { key: 'high',  text: 'severity.high',  color: 'text-[#F05A5A]' },
  ] as const;

  severity = input.required<Severity>();
  config = computed(() => SEVERITY_CONFIG[this.severity()]);
  fillWidth = computed(() => `${this.config().percent}%`);
}
