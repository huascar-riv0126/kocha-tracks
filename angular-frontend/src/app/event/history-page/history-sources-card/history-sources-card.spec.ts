import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { TranslocoService, provideTranslocoConfig } from '@jsverse/transloco';
import { getTranslocoTestingModule } from '@testutils/stubs';
import { HistorySourcesCard, HistorySource } from './history-sources-card';
import es from '../../../../../public/i18n/es.json';
import en from '../../../../../public/i18n/en.json';

const sources: readonly HistorySource[] = Object.freeze([
  { id: 1, name: 'Los Tiempos', url: 'https://www.lostiempos.com/actualidad/cochabamba' },
  { id: 2, name: 'Opinión', url: 'https://www.opinion.com.bo/cochabamba/' },
]);

@Component({ template: '<p>Ficha del evento</p>' })
class EventDetailsDestination {}

describe('HistorySourcesCard', () => {
  let fixture: ComponentFixture<HistorySourcesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorySourcesCard, getTranslocoTestingModule({ es, en })],
      providers: [
        provideRouter([{ path: 'evento/:eventId/detalles', component: EventDetailsDestination }]),
        provideTranslocoConfig({
          availableLangs: ['es', 'en'],
          defaultLang: 'es',
          reRenderOnLangChange: true,
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HistorySourcesCard);
    fixture.componentRef.setInput('eventId', 2);
    fixture.componentRef.setInput('sources', sources);
    await fixture.whenStable();
  });

  it('muestra las fuentes como enlaces al noticiero que se abren de forma segura', () => {
    const links = Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('ul a'));
    expect(links.map((link) => link.textContent?.trim())).toEqual(['Los Tiempos', 'Opinión']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://www.lostiempos.com/actualidad/cochabamba',
      'https://www.opinion.com.bo/cochabamba/',
    ]);
    for (const link of links) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.relList.contains('noopener')).toBe(true);
      expect(link.relList.contains('noreferrer')).toBe(true);
    }
  });

  it('navega a la ficha del evento recibido sin abrir otra pestaña', async () => {
    const link = Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('a')).find(
      (candidate) => candidate.textContent?.includes('Ver ficha del evento'),
    );
    expect(link?.getAttribute('href')).toBe('/evento/2/detalles');
    expect(link?.getAttribute('target')).toBeNull();
    link!.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/evento/2/detalles');
  });

  it('actualiza la ficha y explica la ausencia de fuentes al recibir otro evento', async () => {
    fixture.componentRef.setInput('eventId', 3);
    fixture.componentRef.setInput('sources', []);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('ul a').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No hay fuentes vinculadas a este evento.');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe(
      '/evento/3/detalles',
    );
    expect(sources.length).toBe(2);
  });

  it('traduce el título, la ficha y el estado vacío manteniendo el destino', async () => {
    fixture.componentRef.setInput('sources', []);
    TestBed.inject(TranslocoService).setActiveLang('en');
    await fixture.whenStable();

    const card: HTMLElement = fixture.nativeElement;
    expect(card.querySelector('h2')?.textContent).toContain('Sources and references');
    expect(card.textContent).toContain('No sources are linked to this event.');
    expect(card.querySelector('a')?.textContent).toContain('View event details');
    expect(card.querySelector('a')?.getAttribute('href')).toBe('/evento/2/detalles');
  });
});
