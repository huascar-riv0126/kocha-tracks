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
      name: 'Opinión',
      url: 'https://www.opinion.com.bo/cochabamba/',
      description: 'Periodico digital con titulares y noticias sobre Bolivia, Cochabamba y Globales.',
    },
    {
      id: 4,
      name: 'Alcaldía de Cochabamba',
      url: 'https://www.cochabamba.bo/noticias',
      description: 'Página oficial de la alcaldía de Cochabamba con noticias del departamento.'
    },
    {
      id: 5,
      name: 'Unitel Cochabamba',
      url: 'https://unitel.bo/',
      description: 'Página oficial del Sitio Web de Unitel, canal noticiero de Cochabamba.'
    }

  ];

  getSources(): Observable<Source[]> {
    return of(this.mockSources);
  }
}