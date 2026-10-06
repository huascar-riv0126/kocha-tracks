import { Component, input } from '@angular/core';
import { EventMock } from '../../event-mock.model';
import { MapView } from '../../../map/map-view/map-view';
import { DatePipe } from '@angular/common';

@Component({
  imports: [MapView, DatePipe],
  selector: 'app-details-card',
  templateUrl: './details-card.html',
})
export class DetailsCard {
  readonly event = input<EventMock>();
}
