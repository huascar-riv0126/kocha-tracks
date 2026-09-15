import { TestBed } from '@angular/core/testing';
import { EventMockService } from './event-mock'; 
import { EventMock } from './event-mock.model';

describe('EventMockService', () => {
  let service: EventMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventMockService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Criterio 1 y 2: debería retornar una lista de eventos con las propiedades correctas', () => {
    const events: EventMock[] = service.getEvents();
    
    expect(events.length).toBe(3); 
    
    const firstEvent = events[0];
    expect(firstEvent.id).toBeDefined();
    expect(firstEvent.title).toBeDefined();
    expect(firstEvent.coordinates.length).toBe(2);
    expect(firstEvent.state).toMatch(/activo|resuelto/);
    expect(firstEvent.elapsedTime).toBeDefined();
  });

  it('Criterio 2: debería agregar un evento nuevo al arreglo temporal', () => {
    const mockNewEvent: EventMock = {
      id: 4,
      title: 'Accidente en la Av. Suecia',
      coordinates: [-17.4000, -66.1400],
      state: 'activo',
      elapsedTime: '10 minutos'
    };

    service.addEvent(mockNewEvent);

    const events: EventMock[] = service.getEvents();
    expect(events.length).toBe(4);
    expect(events[3].title).toBe('Accidente en la Av. Suecia');
  });
});