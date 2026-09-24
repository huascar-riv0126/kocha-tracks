import { Component } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { MapView } from '../../map/map-view/map-view';

@Component({
  imports: [GetStringsPipe, MapView],
  selector: 'app-landing-map',
  templateUrl: './landing-map.html',
})
export class LandingMap {}
