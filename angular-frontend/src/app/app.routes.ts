import { Routes } from '@angular/router';
import { MapView } from './map/map-view/map-view';
import { SourcesPage } from './sources-page/sources-page';
import { LandingPage } from './landing/landing-page';
import { ZonesPage } from './map/zones/zones-page/zones-page';
import { EventDetailsPage } from './event/details-page/details-page';
import { eventResolver } from './event/event-resolver';
import { NotFound } from './status/not-found/not-found';
import { Login } from './auth/login/login';
import { SignUp } from './auth/sign-up/sign-up';

export const routes: Routes = [
  { path: '', component: LandingPage },

  { path: 'map', component: MapView },
  
  { path: 'zonas-interes', component: ZonesPage },

  { path: 'fuentes', component: SourcesPage },

  { path: 'login', component: Login },

  { path: 'register', component: SignUp },

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