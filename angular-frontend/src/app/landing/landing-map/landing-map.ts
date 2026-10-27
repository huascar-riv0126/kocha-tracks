import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MapView } from '../../map/map-view/map-view';

@Component({
  imports: [TranslocoPipe, MapView],
  selector: 'app-landing-map',
  templateUrl: './landing-map.html',
})
export class LandingMap {}
