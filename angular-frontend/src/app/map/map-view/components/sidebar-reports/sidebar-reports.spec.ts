import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SidebarReportsComponent } from './sidebar-reports';
import { StringsService } from '../../../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../../../core/strings/strings-token';
import { EventMockService } from '../../../../event/event-mock';

describe('SidebarReportsComponent', () => {
  let component: SidebarReportsComponent;
  let fixture: ComponentFixture<SidebarReportsComponent>;

  const mockEvents = [
    { id: 1, title: 'Bloqueo Activo', state: 'activo', elapsedTime: '10 min', coordinates: [-17.38, -66.15] as [number, number] },
    { id: 2, title: 'Bloqueo Resuelto', state: 'resuelto', elapsedTime: '1 hora', coordinates: [-17.39, -66.16] as [number, number] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarReportsComponent],
      providers: [
        StringsService,
        {
          provide: STRINGS_LOADER,
          useValue: { load: () => Promise.resolve({}) },
        },
        {
          provide: EventMockService,
          useValue: { getEvents: () => mockEvents },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter active events by default', () => {
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].state).toBe('activo');
  });

  it('should switch to historical tab and filter resolved events', () => {
    component.selectTab('historicos');
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].state).toBe('resuelto');
  });
});