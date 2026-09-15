import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Source } from './source-model';

@Injectable({
  providedIn: 'root',
})
export class SourcesService {
  private readonly mockSources: Source[] = [
    {
      id: 1,
      name: 'Fuente de información 1',
      url: 'https://example.com/source-1',
      description: 'Descripción de la primera fuente de información.',
    },
    {
      id: 2,
      name: 'Fuente de información 2',
      url: 'https://example.com/source-2',
      description: 'Descripción de la segunda fuente de información.',
    },
    {
      id: 3,
      name: 'Fuente de información 3',
      url: 'https://example.com/source-3',
      description: 'Descripción de la tercera fuente de información.',
    },
  ];

  getSources(): Observable<Source[]> {
    return of(this.mockSources);
  }
}