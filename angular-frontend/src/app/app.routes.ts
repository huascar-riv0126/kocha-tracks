import { Routes } from '@angular/router';
import { MapView } from './map/map-view/map-view';
import { SourcesPage } from './sources-page/sources-page';
import { LandingPage } from './landing/landing-page';
import { Details } from './event/details/details';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'map', component: MapView },
  { path: 'fuentes', component: SourcesPage },
  { path: 'severidad', component: Details },
  { path: 'event-details/:id', redirectTo: 'map' }
];
