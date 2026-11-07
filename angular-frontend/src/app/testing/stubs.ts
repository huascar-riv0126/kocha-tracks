import { vi } from 'vitest';
import { of } from 'rxjs';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { Source } from '../sources-page/source-model';

export class SourcesServiceStub {
  getSources = vi.fn(() => of<Source[]>([]));
}

export class StringsServiceStub {
  get = vi.fn((key: string) => key);
}

export function getTranslocoTestingModule(langs: Record<string, any> = {}) {
  return TranslocoTestingModule.forRoot({
    langs: {
      es: {},
      en: {},
      ...langs,
    },
    translocoConfig: {
      availableLangs: ['es', 'en'],
      defaultLang: 'es',
    },
    preloadLangs: true,
  });
}