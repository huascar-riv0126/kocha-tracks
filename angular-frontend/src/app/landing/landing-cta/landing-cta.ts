import { Component } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  imports: [GetStringsPipe],
  selector: 'app-landing-cta',
  templateUrl: './landing-cta.html',
})
export class LandingCta {}
