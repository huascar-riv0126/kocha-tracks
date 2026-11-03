import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@testutils/stubs';
import { EventChangeRow } from './event-change-row';
import { EventChange } from '../event-change.model';
import es from '../../../../../public/i18n/es.json';
import en from '../../../../../public/i18n/en.json';

// Example from UH-32; timestamps always represent an instant, independent of the viewer's zone.
const change = {
  id: 'version-2',
  version: 2,
  occurredAt: new Date('2025-03-15T14:00:00Z'),
  type: 'updated' as const,
  title: 'Se actualiza la duración',
  field: 'Duración prevista',
  before: '6 horas',
  after: '8 horas',
  description: 'Se amplía el tiempo previsto del corte.',
};

describe('EventChangeRow', () => {
  let fixture: ComponentFixture<EventChangeRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventChangeRow, getTranslocoTestingModule({ es, en })],
    }).compileComponents();
    fixture = TestBed.createComponent(EventChangeRow);
    fixture.componentRef.setInput('change', change);
    await fixture.whenStable();
  });

  it('muestra los datos del cambio y la hora de Bolivia', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Se actualiza la duración');
    expect(element.textContent).toContain('Duración prevista');
    expect(element.textContent).toContain('6 horas');
    expect(element.textContent).toContain('8 horas');
    expect(element.textContent).toContain('Se amplía el tiempo previsto del corte.');
    expect(element.textContent).toContain('Versión 2');
    expect(element.textContent).toContain('Antes');
    expect(element.textContent).toContain('Después');
    expect(element.textContent).toContain('15 mar 2025');
    expect(element.textContent).toContain('10:00');
    expect(element.textContent).toContain('UTC−4');
    expect(element.querySelector('time')?.getAttribute('datetime')).toBe(
      '2025-03-15T14:00:00.000Z',
    );
  });
  it.each([
    ['started', 'text-status-danger-600', 'bg-status-danger-100'],
    ['updated', 'text-brand-primary-500', 'bg-brand-primary-50'],
    ['finished', 'text-status-success-600', 'bg-status-success-100'],
  ] as const)('representa %s con el color correspondiente', async (type, text, background) => {
    fixture.componentRef.setInput('change', { ...change, type } satisfies EventChange);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector(`h3 svg.${text}`)).not.toBeNull();
    expect(element.querySelector(`span.rounded-full.${text}`)).not.toBeNull();
    expect(element.querySelector(`div.${background}`)?.textContent).toContain('8 horas');
  });

  it('solo muestra las etiquetas de ejemplo cuando el cambio está marcado como ejemplo', async () => {
    expect(fixture.nativeElement.textContent).not.toContain('Ejemplo');
    fixture.componentRef.setInput('change', { ...change, isExample: true });
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent.match(/Ejemplo/g)).toHaveLength(2);
  });

  it('cierra la línea de tiempo después del último cambio', async () => {
    expect(fixture.nativeElement.querySelector('.bg-neutral-300')).not.toBeNull();
    fixture.componentRef.setInput('last', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.bg-neutral-300')).toBeNull();
  });
});
