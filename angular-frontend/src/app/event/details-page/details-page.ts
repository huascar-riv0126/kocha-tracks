import { Component, input } from '@angular/core';
import { ActionsCard } from './actions-card/actions-card';
import { SeverityCard } from './severity-card/severity-card';
import { EventMock } from '../event-mock.model';
import { DetailsCard } from './details-card/details-card';
import { RouterLink } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';

@Component({
  imports: [ActionsCard, SeverityCard, DetailsCard, RouterLink, GetStringsPipe],
  selector: 'app-event-details-page',
  templateUrl: './details-page.html',
})
export class EventDetailsPage {
  readonly event = input.required<EventMock>();
}
