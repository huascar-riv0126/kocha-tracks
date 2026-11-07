import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService, provideTranslocoConfig } from '@jsverse/transloco';
import { getTranslocoTestingModule } from '@testutils/stubs';
import { HistoryHelpCard } from './history-help-card';
import es from '../../../../../public/i18n/es.json';
import en from '../../../../../public/i18n/en.json';

describe('HistoryHelpCard', () => {
  let fixture: ComponentFixture<HistoryHelpCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryHelpCard, getTranslocoTestingModule({ es, en })],
      providers: [
        provideTranslocoConfig({
          availableLangs: ['es', 'en'],
          defaultLang: 'es',
          reRenderOnLangChange: true,
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HistoryHelpCard);
    await fixture.whenStable();
  });

  it('explica los cambios, el orden y el estado actual en el idioma elegido', async () => {
    const card: HTMLElement = fixture.nativeElement;
    expect(card.querySelector('h2')?.textContent).toContain('Cómo leer este historial');
    expect(card.textContent).toContain('valores anteriores y nuevos');
    expect(card.textContent).toContain('fechas más recientes y las más antiguas');
    expect(card.textContent).toContain('rojo si el evento sigue activo');
    expect(card.textContent).toContain('verde cuando ya finalizó');
    expect(card.textContent).toContain('UTC−4');

    TestBed.inject(TranslocoService).setActiveLang('en');
    await fixture.whenStable();
    expect(card.querySelector('h2')?.textContent).toContain('How to read this history');
    expect(card.textContent).toContain('previous and new values');
    expect(card.textContent).toContain('newest and oldest dates');
    expect(card.textContent).toContain('red while the event is active');
    expect(card.textContent).toContain('green once it has finished');
  });
});
