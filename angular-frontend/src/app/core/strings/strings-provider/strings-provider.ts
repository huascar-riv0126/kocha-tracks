import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { STRINGS_LOADER } from '../strings-token';
import { StringsService } from '../strings-service/strings-service';
import { clientStringsLoader } from '../strings-loader/strings-loader-client';

/** Registers the browser strings loader and loads the dictionary before the app renders. */
export function provideStrings(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: STRINGS_LOADER, useValue: clientStringsLoader },
    provideAppInitializer(() => inject(StringsService).load()),
  ]);
}
