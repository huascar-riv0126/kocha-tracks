
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  imports: [TranslocoPipe, RouterLink],
  selector: 'app-landing-cta',
  templateUrl: './landing-cta.html',
})
export class LandingCta {}
