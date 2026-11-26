import { Location } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { MapView } from '../../map/map-view/map-view';
import { LatLng } from '../../map/zones/zone.model';
import { Severity } from '../details-page/severity-card/severity-card';
import { EVENT_CATEGORIES, EventCategory } from '../event-category';
import { EventReport } from './event-report.model';
import { EventReportService } from './event-report-service';

type RequiredField = 'title' | 'category' | 'description' | 'reference' | 'location';
type TextField = 'title' | 'description' | 'reference' | 'source' | 'notes';

const REQUIRED_FIELDS: readonly RequiredField[] = ['title', 'category', 'description', 'reference', 'location'];

export const REPORT_DEFAULT_SEVERITY: Severity = 'mid';

export interface ReportSeverityOption {
  value: Severity;
  labelKey: string;
  dotClass: string;
  selectedClass: string;
}

export const REPORT_SEVERITY_OPTIONS: readonly ReportSeverityOption[] = [
  {
    value: 'low',
    labelKey: 'report.severity.low',
    dotClass: 'bg-status-success-500',
    selectedClass: 'border-status-success-500 ring-1 ring-status-success-500 text-status-success-600',
  },
  {
    value: 'mid',
    labelKey: 'report.severity.mid',
    dotClass: 'bg-accent-warning-500',
    selectedClass: 'border-accent-warning-500 ring-1 ring-accent-warning-500 text-accent-warning-600',
  },
  {
    value: 'high',
    labelKey: 'report.severity.high',
    dotClass: 'bg-status-danger-500',
    selectedClass: 'border-status-danger-500 ring-1 ring-status-danger-500 text-status-danger-600',
  },
];

@Component({
  selector: 'app-report-page',
  imports: [GetStringsPipe, MapView],
  templateUrl: './report-page.html',
})
export class ReportPage {
  private readonly reportService = inject(EventReportService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  readonly categories = EVENT_CATEGORIES;
  readonly severityOptions = REPORT_SEVERITY_OPTIONS;

  readonly title = signal('');
  readonly category = signal<EventCategory | ''>('');
  readonly description = signal('');
  readonly reference = signal('');
  readonly mapLocation = signal<LatLng | null>(null);
  readonly severity = signal<Severity>(REPORT_DEFAULT_SEVERITY);
  readonly source = signal('');
  readonly notes = signal('');

  /** Modo "Seleccionar en el mapa": mientras está activo, cada clic en el mapa coloca el marcador. */
  readonly selectingOnMap = signal(false);
  /** Muestra el mensaje de confirmación después de un envío exitoso. */
  readonly submitted = signal(false);

  private readonly touched = signal<ReadonlySet<RequiredField>>(new Set());

  private readonly textFields: Record<TextField, WritableSignal<string>> = {
    title: this.title,
    description: this.description,
    reference: this.reference,
    source: this.source,
    notes: this.notes,
  };

  private readonly errorKeys = computed<Record<RequiredField, string | null>>(() => ({
    title: this.title().trim() ? null : 'report.error.title.required',
    category: this.category() ? null : 'report.error.category.required',
    description: this.description().trim() ? null : 'report.error.description.required',
    reference: this.reference().trim() ? null : 'report.error.reference.required',
    location: this.mapLocation() ? null : 'report.error.location.required',
  }));

  readonly formValid = computed(() => REQUIRED_FIELDS.every((field) => this.errorKeys()[field] === null));

  /** Errores visibles: solo de los campos que el usuario ya tocó o intentó enviar. */
  readonly errors = computed<Record<RequiredField, string | null>>(() => {
    const keys = this.errorKeys();
    const touched = this.touched();
    return {
      title: touched.has('title') ? keys.title : null,
      category: touched.has('category') ? keys.category : null,
      description: touched.has('description') ? keys.description : null,
      reference: touched.has('reference') ? keys.reference : null,
      location: touched.has('location') ? keys.location : null,
    };
  });

  readonly formattedLocation = computed(() => {
    const point = this.mapLocation();
    return point ? `${point[0].toFixed(5)}, ${point[1].toFixed(5)}` : null;
  });

  touch(field: RequiredField): void {
    this.touched.update((current) => (current.has(field) ? current : new Set(current).add(field)));
  }

  onTextInput(field: TextField, event: Event): void {
    this.textFields[field].set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
    this.submitted.set(false);
  }

  onCategoryChange(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value as EventCategory | '');
    this.touch('category');
    this.submitted.set(false);
  }

  selectSeverity(value: Severity): void {
    this.severity.set(value);
    this.submitted.set(false);
  }

  toggleMapSelection(): void {
    this.selectingOnMap.update((active) => !active);
  }

  onLocationSelect(point: LatLng): void {
    this.mapLocation.set(point);
    this.touch('location');
    this.submitted.set(false);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.touched.set(new Set(REQUIRED_FIELDS));

    const location = this.mapLocation();
    const category = this.category();
    if (!this.formValid() || !location || !category) return;

    const report: EventReport = {
      title: this.title().trim(),
      category,
      description: this.description().trim(),
      reference: this.reference().trim(),
      location,
      severity: this.severity(),
      source: this.optional(this.source()),
      notes: this.optional(this.notes()),
    };

    this.reportService.submitReport(report).subscribe(() => {
      this.resetForm();
      this.submitted.set(true);
    });
  }

  /** Vuelve a la página anterior; si no hay historial, va al inicio (mismo criterio que InProgress). */
  onCancel(): void {
    const state = this.location.getState() as { navigationId?: number } | null;
    if (state && typeof state.navigationId === 'number' && state.navigationId > 1) {
      this.location.back();
      return;
    }
    void this.router.navigateByUrl('/');
  }

  private resetForm(): void {
    this.title.set('');
    this.category.set('');
    this.description.set('');
    this.reference.set('');
    this.mapLocation.set(null);
    this.severity.set(REPORT_DEFAULT_SEVERITY);
    this.source.set('');
    this.notes.set('');
    this.selectingOnMap.set(false);
    this.touched.set(new Set());
  }

  private optional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
}
