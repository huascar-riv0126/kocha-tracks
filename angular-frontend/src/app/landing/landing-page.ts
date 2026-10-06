import { Component } from '@angular/core';
import { LandingHero } from './landing-hero/landing-hero';
import { LandingMap } from './landing-map/landing-map';
import { LandingFeatures } from './landing-features/landing-features';
import { LandingSteps } from './landing-steps/landing-steps';
import { LandingCta } from './landing-cta/landing-cta';

@Component({
  imports: [LandingHero, LandingMap, LandingFeatures, LandingSteps, LandingCta],
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
})
export class LandingPage {}
