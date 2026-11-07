import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { DataFlowCard } from '../../sources-page/sources-data-flow/data-flow-grid/data-flow-card/data-flow-card';

@Component({
  imports: [TranslocoPipe, DataFlowCard],
  selector: 'app-landing-steps',
  templateUrl: './landing-steps.html',
})
export class LandingSteps {
  protected readonly steps = [
    {
      number: '01',
      titleKey: 'landing.steps.step1.title',
      descKey: 'landing.steps.step1.desc',
      icon: 'icons/pin.svg',
    },
    {
      number: '02',
      titleKey: 'landing.steps.step2.title',
      descKey: 'landing.steps.step2.desc',
      icon: 'icons/chat.svg',
    },
    {
      number: '03',
      titleKey: 'landing.steps.step3.title',
      descKey: 'landing.steps.step3.desc',
      icon: 'icons/archive.svg',
    },
  ];
}
