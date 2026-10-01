import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionsCard } from './actions-card/actions-card';
import { SeverityCard } from './severity-card/severity-card';
import { EventMockService } from '../event-mock';
import { EventMock } from '../event-mock.model';
import { DetailsCard } from './details-card/details-card';

@Component({
  imports: [ActionsCard, SeverityCard, DetailsCard],
  selector: 'app-event-details-page',
  templateUrl: './details-page.html',
})
export class EventDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventMockService);
  
  event?: EventMock;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.event = this.eventService.getEvent(id);
    }
  }
}