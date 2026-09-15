import { Component } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  imports: [GetStringsPipe],
  selector: 'app-sources-hero',
  templateUrl: './sources-hero.html',
})
export class SourcesHero {}
