import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Filter } from './filter';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { setRequiredInputs } from '@testutils/set-required-inputs';
import { StringsServiceStub } from '@testutils/stubs';

describe('Filter', () => {
  let fixture: ComponentFixture<Filter>;
  let emitted: string[];

  const chips = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));
  const texts = () => chips().map((c) => c.textContent!.trim());
  const isSelected = (chip: HTMLElement) =>
    chip.classList.contains('bg-interactive-cta') && !chip.classList.contains('bg-surface');
  const isWhite = (chip: HTMLElement) =>
    chip.classList.contains('bg-surface') && !chip.classList.contains('bg-interactive-cta');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filter],
      providers: [{ provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Filter);
    setRequiredInputs(fixture, { filters: ['alto', 'bajo', 'medio'] });
    emitted = [];
    fixture.componentInstance.filterChange.subscribe((v: string) => emitted.push(v));
    await fixture.whenStable();
  });

  describe('UI', () => {
    it('renderiza "Todos" primero y luego las palabras capitalizadas', () => {
      expect(texts()).toEqual(['filter.all', 'Alto', 'Bajo', 'Medio']);
    });

    it('funciona con cualquier lista de palabras', async () => {
      setRequiredInputs(fixture, { filters: ['perro', 'gato'] });
      await fixture.whenStable();
      expect(texts()).toEqual(['filter.all', 'Perro', 'Gato']);
    });

    it('con lista vacía solo muestra "Todos"', async () => {
      setRequiredInputs(fixture, { filters: [] });
      await fixture.whenStable();
      expect(chips().length).toBe(1);
    });

    it('"Todos" está seleccionado (naranja) por defecto y los demás en blanco', () => {
      const [all, ...rest] = chips();
      expect(isSelected(all)).toBe(true);
      expect(all.getAttribute('aria-pressed')).toBe('true');
      rest.forEach((c) => expect(isWhite(c)).toBe(true));
    });

    it('al hacer click, el filtro pasa a naranja y los demás a blanco', async () => {
      chips()[2].click();
      await fixture.whenStable();
      const c = chips();
      expect(isSelected(c[2])).toBe(true);
      expect(c[2].getAttribute('aria-pressed')).toBe('true');
      [c[0], c[1], c[3]].forEach((x) => {
        expect(isWhite(x)).toBe(true);
        expect(x.getAttribute('aria-pressed')).toBe('false');
      });
    });

    it('la selección se mueve de un filtro a otro y puede volver a "Todos"', async () => {
      chips()[1].click();
      await fixture.whenStable();
      chips()[3].click();
      await fixture.whenStable();
      expect(isSelected(chips()[3])).toBe(true);
      expect(isWhite(chips()[1])).toBe(true);

      chips()[0].click();
      await fixture.whenStable();
      expect(isSelected(chips()[0])).toBe(true);
      expect(isWhite(chips()[3])).toBe(true);
    });

    it('usa solo variables del tema (sin colores hardcodeados)', () => {
      const html = fixture.nativeElement.innerHTML as string;
      expect(html).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgb\(/);
    });
  });

  describe('Señal de salida', () => {
    it('emite el contenido del filtro seleccionado', async () => {
      chips()[1].click();
      chips()[2].click();
      chips()[3].click();
      expect(emitted).toEqual(['alto', 'bajo', 'medio']);
    });

    it('emite "Todos" al seleccionar el chip "Todos"', () => {
      chips()[1].click();
      chips()[0].click();
      expect(emitted).toEqual(['alto', 'filter.all']);
    });

    it('no emite nada antes de que el usuario haga click', () => {
      const spy = vi.fn();
      fixture.componentInstance.filterChange.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
