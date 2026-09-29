import { vi } from 'vitest';
import { of } from 'rxjs';
import { Source } from '../sources-page/source-model'; // adjust path

export class SourcesServiceStub {
  getSources = vi.fn(() => of<Source[]>([]));
}

export class StringsServiceStub {
  get = vi.fn((key: string) => key);
}