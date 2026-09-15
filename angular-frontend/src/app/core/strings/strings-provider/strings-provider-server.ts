import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { STRINGS_LOADER } from '../strings-token';
import { serverStringsLoader } from '../strings-loader/strings-loader-server';

/** Overrides the browser loader with the disk-based one when rendering on the server. */
export function provideStringsServer(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: STRINGS_LOADER, useValue: serverStringsLoader },
  ]);
}
