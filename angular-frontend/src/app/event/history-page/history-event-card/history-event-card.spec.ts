import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService, provideTranslocoConfig } from '@jsverse/transloco';
import { getTranslocoTestingModule } from '@testutils/stubs';
import { EventMock } from '../../event-mock.model';
import { HistoryEventCard } from './history-event-card';
import es from '../../../../../public/i18n/es.json';
import en from '../../../../../public/i18n/en.json';

const event: EventMock = {
  id: 1,
  title: 'Bloqueo en Av. Blanco Galindo',
  coordinates: [-17.3930435, -66.1959006],
  state: 'activo',
  severity: 'low',
  elapsedTime: '2 horas',
  type: 'Bloqueo vial',
  location: 'Av. Blanco Galindo Km 3',
  description: 'Bloqueo parcial de un carril.',
  startDate: new Date('2026-10-02T02:30:00Z'),
};

describe('HistoryEventCard', () => {
  let fixture: ComponentFixture<HistoryEventCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryEventCard, getTranslocoTestingModule({ es, en })],
      providers: [
        provideTranslocoConfig({
          availableLangs: ['es', 'en'],
          defaultLang: 'es',
          reRenderOnLangChange: true,
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HistoryEventCard);
    fixture.componentRef.setInput('event', event);
    await fixture.whenStable();
  });

  it('muestra los datos del evento y el estado activo en rojo', () => {
    const card: HTMLElement = fixture.nativeElement;
    expect(card.querySelector('h2')?.textContent).toContain('Bloqueo en Av. Blanco Galindo');
    expect(card.textContent).toContain('Bloqueo vial');
    expect(card.textContent).toContain('Av. Blanco Galindo Km 3');
    expect(card.querySelector('[role="status"]')?.textContent).toContain('Activo');
    expect(card.querySelector('[role="status"]')?.classList).toContain('text-status-danger-600');
  });

  it('actualiza título y estado a finalizado verde cuando cambia el evento recibido', async () => {
    fixture.componentRef.setInput('event', {
      ...event,
      id: 2,
      title: 'Mantenimiento finalizado',
      state: 'resuelto',
    } satisfies EventMock);
    await fixture.whenStable();

    const card: HTMLElement = fixture.nativeElement;
    const status = card.querySelector('[role="status"]');
    expect(card.querySelector('h2')?.textContent).toContain('Mantenimiento finalizado');
    expect(status?.textContent).toContain('Finalizado');
    expect(status?.classList).toContain('text-status-success-600');
    expect(status?.classList).not.toContain('text-status-danger-600');
  });

  it('muestra el inicio en la hora de Bolivia incluso cuando UTC tiene otra fecha', () => {
    const time: HTMLTimeElement | null = fixture.nativeElement.querySelector('time');
    expect(time?.getAttribute('datetime')).toBe('2026-10-02T02:30:00.000Z');
    expect(time?.textContent).toContain('01/10/2026 22:30');
    expect(fixture.nativeElement.textContent).toContain('UTC−4');
  });

  it('traduce los metadatos y el estado al cambiar el idioma', async () => {
    TestBed.inject(TranslocoService).setActiveLang('en');
    await fixture.whenStable();

    const card: HTMLElement = fixture.nativeElement;
    expect(card.textContent).toContain('Event type');
    expect(card.textContent).toContain('Location');
    expect(card.textContent).toContain('Start date');
    expect(card.querySelector('[role="status"]')?.textContent).toContain('Active');
    expect(card.querySelector('h2')?.textContent).toContain('Bloqueo en Av. Blanco Galindo');

    fixture.componentRef.setInput('event', { ...event, state: 'resuelto' } satisfies EventMock);
    await fixture.whenStable();
    expect(card.querySelector('[role="status"]')?.textContent).toContain('Finished');
  });
});
