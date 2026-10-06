import { Routes } from '@angular/router';
import { MapView } from './map/map-view/map-view';
import { SourcesPage } from './sources-page/sources-page';
import { LandingPage } from './landing/landing-page';
import { EventDetailsPage } from './event/details-page/details-page';
import { eventResolver } from './event/event-resolver';
import { NotFound } from './status/not-found/not-found';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'map', component: MapView },
  { path: 'fuentes', component: SourcesPage },
  {
    path: 'evento/:eventId',
    resolve: { event: eventResolver },
    children: [
      { path: 'detalles', component: EventDetailsPage },
      { path: 'historial', component: EventDetailsPage },
      { path: '', redirectTo: 'detalles', pathMatch: 'full' }
    ]
  },
  { path: '**', component: NotFound }
];
