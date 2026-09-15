import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-data-flow-card',
  templateUrl: './data-flow-card.html',
})
export class DataFlowCard {
  readonly number = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
