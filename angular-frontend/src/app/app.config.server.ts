import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideStringsServer } from './core/strings/strings-provider/strings-provider-server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideStringsServer()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
