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
      coordinates: [-17.3935, -66.1950],
      state: 'activo',
      elapsedTime: '2 horas'
    },
    {
      id: 2,
      title: 'Mantenimiento en Av. América',
      coordinates: [-17.3750, -66.1600],
      state: 'resuelto',
      elapsedTime: '5 horas'
    },
    {
      id: 3,
      title: 'Inundación por lluvias - Zona Sur',
      coordinates: [-17.4150, -66.1500],
      state: 'activo',
      elapsedTime: '45 minutos'
    }
  ];

  constructor() { }

  // Obtener todos los eventos (Síncrono)
  getEvents(): EventMock[] {
    return this.events;
  }

  // Agregar un evento nuevo
  addEvent(newEvent: EventMock): void {
    this.events.push(newEvent);
  }
}