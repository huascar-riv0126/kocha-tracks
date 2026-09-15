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
      name: 'Los Tiempos',
      url: 'https://www.lostiempos.com/actualidad/cochabamba',
      description: 'Periodico digital con titulares y noticias sobre Bolivia, Cochabamba y Globales.',
    },
    {
      id: 2,
      name: 'El Deber',
      url: 'https://eldeber.com.bo/pais/cochabamba',
      description: 'Periodico digital con titulares y noticias sobre Bolivia y Globales.',
    },
    {
      id: 3,
      name: 'Opinion',
      url: 'https://www.opinion.com.bo/cochabamba/',
      description: 'Periodico digital con titulares y noticias sobre Bolivia, Cochabamba y Globales.',
    },
    {
      id: 4,
      name: 'Alcaldia de Cochabamba',
      url: 'https://www.cochabamba.bo/noticias',
      description: 'Pagina oficial de la alcaldia de Cochabamba con noticias del departamento.'
    },
  ];

  getSources(): Observable<Source[]> {
    return of(this.mockSources);
  }
}