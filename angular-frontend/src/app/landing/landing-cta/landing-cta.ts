import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  imports: [TranslocoPipe],
  selector: 'app-landing-cta',
  templateUrl: './landing-cta.html',
})
export class LandingCta {}
