import { Injectable } from '@angular/core';
import { EventMock } from './event-mock.model';

@Injectable({
  providedIn: 'root'
})
export class EventMockService {
  private events: EventMock[] = [
    {
      id: 1,
      title: 'Bloqueo en Av. Blanco Galindo Km 3',
      type: 'Bloqueo vial',
      location: 'Av. Blanco Galindo Km 3, Cochabamba',
      description:
        'Bloqueo parcial de un carril por concentración de personas en la Av. Blanco Galindo Km 3. ' +
        'El tránsito avanza con lentitud, sin riesgo para los vehículos. ' +
        'Se recomienda precaución y usar calles paralelas si es posible.',
      coordinates: [-17.3935, -66.1950],
      state: 'activo',
      severity: 'low',
      startDate: new Date('2026-10-01T12:30:00-04:00'),
      elapsedTime: '2 horas'
    },
    {
      id: 2,
      title: 'Mantenimiento en Av. América',
      type: 'Mantenimiento vial',
      location: 'Av. América, Cochabamba',
      description:
        'Los trabajos de mantenimiento y bacheo en la Av. América ya concluyeron. ' +
        'El tránsito se restableció en ambos carriles, aunque puede haber lentitud en horas pico ' +
        'mientras se retira la señalización.',
      coordinates: [-17.3750, -66.1600],
      state: 'resuelto',
      severity: 'mid',
      startDate: new Date('2026-10-01T09:30:00-04:00'),
      elapsedTime: '5 horas'
    },
    {
      id: 3,
      title: 'Inundación por lluvias - Zona Sur',
      type: 'Inundación de calzada',
      location: 'Zona Sur, Cochabamba',
      description:
        'Fuerte caudal por intensas lluvias inunda la calzada en la Zona Sur y obstruye ambos carriles. ' +
        'El tránsito de vehículos livianos y motocicletas es riesgoso. ' +
        'Evite la zona y use rutas alternas hasta nuevo aviso.',
      coordinates: [-17.4150, -66.1500],
      state: 'activo',
      severity: 'high',
      startDate: new Date('2026-10-01T13:45:00-04:00'),
      elapsedTime: '45 minutos'
    }
  ];

  constructor() { }

  // Obtener todos los eventos (Síncrono)
  getEvents(): EventMock[] {
    return this.events;
  }

  getEvent(id: number): EventMock | undefined {
    return this.events.find(e => e.id === id);
  }

  // Agregar un evento nuevo
  addEvent(newEvent: EventMock): void {
    this.events.push(newEvent);
  }
}