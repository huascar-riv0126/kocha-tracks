import { Component } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { SourceCard } from '../../sources-page/sources-grid/source-card/source-card';

@Component({
  imports: [GetStringsPipe, SourceCard],
  selector: 'app-landing-features',
  templateUrl: './landing-features.html',
})
export class LandingFeatures {
  protected readonly features = [
    {
      titleKey: 'landing.features.card1.title',
      descKey: 'landing.features.card1.desc',
      icon: 'icons/pin.svg',
    },
    {
      titleKey: 'landing.features.card2.title',
      descKey: 'landing.features.card2.desc',
      icon: 'icons/alert-off.svg',
    },
    {
      titleKey: 'landing.features.card3.title',
      descKey: 'landing.features.card3.desc',
      icon: 'icons/archive.svg',
    },
  ];
}
