import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  standalone: true,
  templateUrl: './source-card.html',
})
export class SourceCard {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly linkHref = input<string>('#');
  readonly iconSrc = input<string | undefined>(undefined);
}