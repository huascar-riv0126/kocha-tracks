import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@testutils/stubs';
import { TranslocoService, provideTranslocoConfig } from '@jsverse/transloco';
import { EventHistory } from './event-history';
import { EventChange } from './event-change.model';
import es from '../../../../public/i18n/es.json';
import en from '../../../../public/i18n/en.json';

const changes: readonly EventChange[] = Object.freeze([
  {
    id: '2',
    version: 2,
    occurredAt: new Date('2025-03-15T14:00:00Z'),
    type: 'updated',
    title: 'Actualización',
    field: 'Duración',
    before: '6 horas',
    after: '8 horas',
    description: 'Se amplía el corte.',
  },
  {
    id: '1',
    version: 1,
    occurredAt: new Date('2025-03-15T08:00:00-04:00'),
    type: 'started',
    title: 'Publicación',
    field: 'Estado',
    before: 'Sin registro',
    after: 'En progreso',
    description: 'Se publica el evento.',
  },
  {
    id: '3',
    version: 3,
    occurredAt: new Date('2025-03-15T16:00:00-04:00'),
    type: 'finished',
    title: 'Cierre',
    field: 'Estado',
    before: 'En progreso',
    after: 'Resuelto',
    description: 'Termina el corte.',
  },
]);

describe('EventHistory', () => {
  let fixture: ComponentFixture<EventHistory>;
  const titles = () =>
    Array.from(fixture.nativeElement.querySelectorAll('h3'), (node: HTMLElement) =>
      node.textContent!.trim(),
    );
  const button = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHistory, getTranslocoTestingModule({ es, en })],
      providers: [
        provideTranslocoConfig({
          availableLangs: ['es', 'en'],
          defaultLang: 'es',
          reRenderOnLangChange: true,
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EventHistory);
    fixture.componentRef.setInput('changes', changes);
    await fixture.whenStable();
  });

  it('muestra los más recientes primero y alterna orden y texto en cada click sin mutar la entrada', async () => {
    expect(titles()).toEqual(['Cierre', 'Actualización', 'Publicación']);
    expect(button().textContent).toContain('Más recientes primero');
    button().click();
    await fixture.whenStable();
    expect(titles()).toEqual(['Publicación', 'Actualización', 'Cierre']);
    expect(button().textContent).toContain('Más antiguos primero');
    button().click();
    await fixture.whenStable();
    expect(titles()).toEqual(['Cierre', 'Actualización', 'Publicación']);
    expect(button().textContent).toContain('Más recientes primero');
    expect(changes.map((change) => change.id)).toEqual(['2', '1', '3']);
  });
  it('actualiza los registros recibidos manteniendo el orden elegido', async () => {
    button().click();
    fixture.componentRef.setInput('changes', [changes[2], changes[0]]);
    await fixture.whenStable();
    expect(titles()).toEqual(['Actualización', 'Cierre']);
    expect(fixture.nativeElement.textContent).toContain('2 registros');
  });

  it('compara instantes y conserva el orden de entrada para fechas iguales', async () => {
    fixture.componentRef.setInput('changes', [
      { ...changes[0], occurredAt: new Date('2025-03-15T10:00:00-04:00') },
      { ...changes[1], occurredAt: new Date('2025-03-15T13:00:00Z') },
      { ...changes[2], occurredAt: new Date('2025-03-15T14:00:00Z') },
    ]);
    await fixture.whenStable();
    expect(titles()).toEqual(['Actualización', 'Cierre', 'Publicación']);
    button().click();
    await fixture.whenStable();
    expect(titles()).toEqual(['Publicación', 'Actualización', 'Cierre']);
  });

  it('muestra un estado vacío cuando no hay cambios', async () => {
    fixture.componentRef.setInput('changes', []);
    await fixture.whenStable();
    expect(titles()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('0 registros');
    expect(fixture.nativeElement.textContent).toContain('No hay cambios registrados.');
  });

  it('traduce los textos y fechas al cambiar el idioma sin perder el orden', async () => {
    button().click();
    TestBed.inject(TranslocoService).setActiveLang('en');
    await fixture.whenStable();
    expect(button().textContent).toContain('Oldest first');
    expect(fixture.nativeElement.textContent).toContain('Changes over time');
    expect(fixture.nativeElement.textContent).toContain('3 records');
    expect(
      Array.from(
        fixture.nativeElement.querySelectorAll('time span:first-child'),
        (node: HTMLElement) => node.textContent!.trim(),
      ),
    ).toEqual(['15 Mar 2025', '15 Mar 2025', '15 Mar 2025']);
    expect(fixture.nativeElement.textContent).toContain('Version 1');
    expect(titles()).toEqual(['Publicación', 'Actualización', 'Cierre']);
  });
  it('usa el singular para un solo registro en ambos idiomas', async () => {
    fixture.componentRef.setInput('changes', [changes[0]]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('1 registro');
    expect(fixture.nativeElement.textContent).not.toContain('1 registros');
    TestBed.inject(TranslocoService).setActiveLang('en');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('1 record');
    expect(fixture.nativeElement.textContent).not.toContain('1 records');
  });
});
