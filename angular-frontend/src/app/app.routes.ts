import { Routes } from '@angular/router';
import { MapView } from './map/map-view/map-view';
import { SourcesPage } from './sources-page/sources-page';
import { LandingPage } from './landing/landing-page';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'map', component: MapView},
    { path: 'fuentes', component: SourcesPage},
    { path: 'event-details/:id', redirectTo: 'map' } 
];
