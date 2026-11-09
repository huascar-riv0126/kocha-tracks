
import { Routes } from '@angular/router';
import { MapView } from './map/map-view/map-view';
import { SourcesPage } from './sources-page/sources-page';
import { LandingPage } from './landing/landing-page';
import { ZonesPage } from './map/zones/zones-page/zones-page';
import { EventDetailsPage } from './event/details-page/details-page';
import { EventHistoryPage } from './event/history-page/history-page';
import { eventResolver } from './event/event-resolver';
import { NotFound } from './status/not-found/not-found';
import { Login } from './auth/login/login';
import { RecoverPassword } from './auth/recover-password/recover-password'; // UH-47
import { SignUp } from './auth/sign-up/sign-up';
import { ProfilePageComponent } from './user/profile-page/profile-page';

export const routes: Routes = [
  { path: '', component: LandingPage },

  { path: 'map', component: MapView },

  { path: 'zonas-interes', component: ZonesPage },

  { path: 'fuentes', component: SourcesPage },

  { path: 'login', component: Login },

  { path: 'auth/recuperar-contrasena', component: RecoverPassword }, // UH-47

  { path: 'register', component: SignUp },

  { path: 'perfil', component: ProfilePageComponent },

  {
    path: 'evento/:eventId',
    resolve: { event: eventResolver },
    children: [
      { path: 'detalles', component: EventDetailsPage },
      { path: 'historial', component: EventHistoryPage },
      { path: '', redirectTo: 'detalles', pathMatch: 'full' },
    ],
  },

  { path: '**', component: NotFound },
];
