import { Component } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  imports: [GetStringsPipe],
  selector: 'app-landing-hero',
  templateUrl: './landing-hero.html',
})
export class LandingHero {
  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
