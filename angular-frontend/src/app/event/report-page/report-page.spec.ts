import { Location } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { StringsServiceStub } from '@testutils/stubs';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { MapView } from '../../map/map-view/map-view';
import { LatLng } from '../../map/zones/zone.model';
import { EVENT_CATEGORIES } from '../event-category';
import { EventReport } from './event-report.model';
import { EventReportService } from './event-report-service';
import { ReportPage } from './report-page';

// Sustituye al mapa real para no depender de Leaflet en estas pruebas
@Component({ selector: 'app-map-view', template: '' })
class MapViewStub {
  readonly mapId = input<string>('map');
  readonly embedded = input<boolean>(false);
  readonly showEvents = input<boolean>(true);
  readonly selectable = input<boolean>(false);
  readonly selectedLocation = input<LatLng | null>(null);
  readonly locationSelect = output<LatLng>();
}

describe('UH-55 - ReportPage', () => {
  let fixture: ComponentFixture<ReportPage>;
  let el: HTMLElement;
  let reportService: { submitReport: ReturnType<typeof vi.fn> };
  let location: { back: ReturnType<typeof vi.fn>; getState: ReturnType<typeof vi.fn> };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  const query = <T extends HTMLElement>(testId: string): T => el.querySelector(`[data-testid="${testId}"]`) as T;

  const mapStub = (): MapViewStub => fixture.debugElement.query(By.directive(MapViewStub)).componentInstance;

  const type = (testId: string, value: string) => {
    const field = query<HTMLInputElement | HTMLTextAreaElement>(testId);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  const chooseCategory = (value: string) => {
    const select = query<HTMLSelectElement>('report-category');
    select.value = value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  const pickOnMap = (point: LatLng) => {
    query<HTMLButtonElement>('report-map-select').click();
    fixture.detectChanges();
    mapStub().locationSelect.emit(point);
    fixture.detectChanges();
  };

  const submit = () => {
    query<HTMLButtonElement>('report-submit').click();
    fixture.detectChanges();
  };

  const fillRequiredFields = () => {
    type('report-title-input', '  Bloqueo en Av. Heroínas  ');
    chooseCategory('roadblock');
    type('report-description', 'Bloqueo total por una marcha.');
    type('report-reference', 'Av. Heroínas y Ayacucho');
    pickOnMap([-17.3935, -66.157]);
  };

  beforeEach(async () => {
    reportService = { submitReport: vi.fn((report: EventReport) => of(report)) };
    location = { back: vi.fn(), getState: vi.fn(() => ({ navigationId: 2 })) };
    router = { navigateByUrl: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ReportPage],
      providers: [
        { provide: StringsService, useClass: StringsServiceStub },
        { provide: EventReportService, useValue: reportService },
        { provide: Location, useValue: location },
        { provide: Router, useValue: router },
      ],
    })
      .overrideComponent(ReportPage, {
        remove: { imports: [MapView] },
        add: { imports: [MapViewStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ReportPage);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debería mostrar el título, el subtítulo y el aviso de revisión con textos del archivo de strings', () => {
    expect(query('report-title').textContent?.trim()).toBe('report.title');
    expect(query('report-subtitle').textContent?.trim()).toBe('report.subtitle');
    expect(query('report-notice').textContent?.trim()).toBe('report.notice');
  });

  it('debería marcar con asterisco los 6 campos obligatorios', () => {
    expect(el.querySelectorAll('[data-testid="required-mark"]').length).toBe(6);
  });

  it('debería mostrar la opción inicial y las categorías del sistema en "Tipo de evento"', () => {
    const options = Array.from(query<HTMLSelectElement>('report-category').options);
    expect(options[0].value).toBe('');
    expect(options[0].textContent?.trim()).toBe('report.field.category.placeholder');
    expect(options.slice(1).map((option) => option.value)).toEqual(EVENT_CATEGORIES.map((category) => category.value));
    expect(options.slice(1).map((option) => option.textContent?.trim())).toEqual(
      EVENT_CATEGORIES.map((category) => category.labelKey),
    );
  });

  it('debería reutilizar el mapa interactivo sin marcadores de eventos ni selección activa al inicio', () => {
    const map = mapStub();
    expect(map.embedded()).toBe(true);
    expect(map.showEvents()).toBe(false);
    expect(map.selectable()).toBe(false);
    expect(map.selectedLocation()).toBeNull();
  });

  it('debería activar la selección en el mapa al pulsar "Seleccionar en el mapa"', () => {
    const button = query<HTMLButtonElement>('report-map-select');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(mapStub().selectable()).toBe(true);
    expect(query('report-map-hint').textContent?.trim()).toBe('report.field.map.selecting');
  });

  it('debería colocar el marcador y mostrar las coordenadas al hacer clic en el mapa, y moverlo con un nuevo clic', () => {
    pickOnMap([-17.3935, -66.157]);
    expect(mapStub().selectedLocation()).toEqual([-17.3935, -66.157]);
    expect(query('report-map-coordinates').textContent?.trim()).toBe('-17.39350, -66.15700');

    mapStub().locationSelect.emit([-17.4, -66.16]);
    fixture.detectChanges();
    expect(mapStub().selectedLocation()).toEqual([-17.4, -66.16]);
  });

  it('debería tener "Media" seleccionada por defecto en la severidad', () => {
    expect(query('report-severity-mid').getAttribute('aria-pressed')).toBe('true');
    expect(query('report-severity-low').getAttribute('aria-pressed')).toBe('false');
    expect(query('report-severity-high').getAttribute('aria-pressed')).toBe('false');
  });

  it('debería permitir una sola severidad seleccionada y resaltarla', () => {
    query<HTMLButtonElement>('report-severity-high').click();
    fixture.detectChanges();

    expect(query('report-severity-high').getAttribute('aria-pressed')).toBe('true');
    expect(query('report-severity-high').classList).toContain('border-status-danger-500');
    expect(query('report-severity-mid').getAttribute('aria-pressed')).toBe('false');
    expect(query('report-severity-low').getAttribute('aria-pressed')).toBe('false');
  });

  it('no debería enviar el reporte y debería mostrar un error por cada campo obligatorio vacío', () => {
    submit();

    expect(reportService.submitReport).not.toHaveBeenCalled();
    expect(query('report-title-error').textContent?.trim()).toBe('report.error.title.required');
    expect(query('report-category-error').textContent?.trim()).toBe('report.error.category.required');
    expect(query('report-description-error').textContent?.trim()).toBe('report.error.description.required');
    expect(query('report-reference-error').textContent?.trim()).toBe('report.error.reference.required');
    expect(query('report-location-error').textContent?.trim()).toBe('report.error.location.required');
    expect(query('report-title-input').getAttribute('aria-invalid')).toBe('true');
    expect(query('report-success')).toBeNull();
  });

  it('no debería enviar el reporte si falta el punto en el mapa', () => {
    type('report-title-input', 'Bloqueo');
    chooseCategory('protest');
    type('report-description', 'Marcha en la plaza.');
    type('report-reference', 'Plaza 14 de Septiembre');
    submit();

    expect(reportService.submitReport).not.toHaveBeenCalled();
    expect(query('report-location-error')).toBeTruthy();
    expect(query('report-title-error')).toBeNull();
  });

  it('debería quitar el error de un campo cuando el usuario lo completa', () => {
    submit();
    expect(query('report-title-error')).toBeTruthy();

    type('report-title-input', 'Bloqueo en Av. América');

    expect(query('report-title-error')).toBeNull();
  });

  it('debería enviar el reporte con los datos ingresados cuando el formulario es válido', () => {
    fillRequiredFields();
    query<HTMLButtonElement>('report-severity-low').click();
    type('report-source', ' https://www.lostiempos.com/nota ');
    type('report-notes', 'Hay desvíos por la Av. Oquendo.');
    submit();

    expect(reportService.submitReport).toHaveBeenCalledWith({
      title: 'Bloqueo en Av. Heroínas',
      category: 'roadblock',
      description: 'Bloqueo total por una marcha.',
      reference: 'Av. Heroínas y Ayacucho',
      location: [-17.3935, -66.157],
      severity: 'low',
      source: 'https://www.lostiempos.com/nota',
      notes: 'Hay desvíos por la Av. Oquendo.',
    });
  });

  it('debería omitir los campos opcionales vacíos al enviar', () => {
    fillRequiredFields();
    submit();

    const report = reportService.submitReport.mock.calls[0][0] as EventReport;
    expect(report.source).toBeUndefined();
    expect(report.notes).toBeUndefined();
    expect(report.severity).toBe('mid');
  });

  it('debería mostrar la confirmación y limpiar el formulario después de enviar', () => {
    fillRequiredFields();
    query<HTMLButtonElement>('report-severity-high').click();
    type('report-notes', 'Nota');
    submit();

    expect(query('report-success').textContent?.trim()).toBe('report.success');
    expect(query<HTMLInputElement>('report-title-input').value).toBe('');
    expect(query<HTMLSelectElement>('report-category').value).toBe('');
    expect(query<HTMLTextAreaElement>('report-description').value).toBe('');
    expect(query<HTMLInputElement>('report-reference').value).toBe('');
    expect(query<HTMLTextAreaElement>('report-notes').value).toBe('');
    expect(mapStub().selectedLocation()).toBeNull();
    expect(mapStub().selectable()).toBe(false);
    expect(query('report-severity-mid').getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelectorAll('[role="alert"]').length).toBe(0);
  });

  it('debería volver a la página anterior al pulsar "Cancelar"', () => {
    query<HTMLButtonElement>('report-cancel').click();

    expect(location.back).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('debería ir al inicio al pulsar "Cancelar" si no hay página anterior', () => {
    location.getState.mockReturnValue({ navigationId: 1 });

    query<HTMLButtonElement>('report-cancel').click();

    expect(location.back).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('debería usar una sola columna en móvil para la severidad y los botones', () => {
    expect(query('report-severity').classList).toContain('grid-cols-1');
    expect(query('report-severity').classList).toContain('sm:grid-cols-3');
    const actions = query('report-submit').parentElement as HTMLElement;
    expect(actions.classList).toContain('flex-col-reverse');
    expect(actions.classList).toContain('sm:flex-row');
  });
});
