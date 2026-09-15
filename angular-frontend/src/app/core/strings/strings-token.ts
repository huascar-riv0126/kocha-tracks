import { InjectionToken } from '@angular/core';

export type StringsLoader = () => Promise<Record<string, string>>;

export const STRINGS_LOADER = new InjectionToken<StringsLoader>('STRINGS_LOADER');
