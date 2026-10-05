import { TestBed } from '@angular/core/testing';
import { EventMockService } from './event-mock';
import { EventMock } from './event-mock.model';

describe('EventMockService', () => {
  let service: EventMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventMockService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return a Event list', () => {
    const events: EventMock[] = service.getEvents();

    expect(events.length).toBe(3);

    const firstEvent = events[0];
    expect(firstEvent.id).toBeDefined();
    expect(firstEvent.title).toBeDefined();
    expect(firstEvent.coordinates.length).toBe(2);
    expect(firstEvent.state).toMatch(/activo|resuelto/);
    expect(firstEvent.elapsedTime).toBeDefined();
  });

  it('should add a new Event into the list', () => {
    const mockNewEvent: EventMock = {
      id: 4,
      title: 'Test Event',
      coordinates: [-17.4000, -66.1400],
      state: 'activo',
      elapsedTime: '10 minutes',
      severity: 'low',
      type: 'Test',
      location: 'Location for test',
      description: 'Description for test',
      startDate: new Date('2026-10-01T13:45:00-04:00')
    };

    service.addEvent(mockNewEvent);

    const events: EventMock[] = service.getEvents();
    expect(events.length).toBe(4);
    expect(events[3]).toBe(mockNewEvent);
  });
});