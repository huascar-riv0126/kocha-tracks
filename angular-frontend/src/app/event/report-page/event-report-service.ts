import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventReport } from './event-report.model';

/**
 * Servicio simulado para enviar reportes de eventos (UH-55).
 * Todavía no existe integración con la API: los reportes se guardan en memoria.
 */
@Injectable({
  providedIn: 'root',
})
export class EventReportService {
  private readonly reports: EventReport[] = [];

  submitReport(report: EventReport): Observable<EventReport> {
    this.reports.push(report);
    return of(report);
  }

  getReports(): readonly EventReport[] {
    return this.reports;
  }
}
