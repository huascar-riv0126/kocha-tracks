import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ReportCardComponent } from './report-card';
import { StringsService } from '../../../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../../../core/strings/strings-token';
import { EventMock } from '../../../../event/event-mock.model';

describe('ReportCardComponent', () => {
  let component: ReportCardComponent;
  let fixture: ComponentFixture<ReportCardComponent>;

  const testEvent: EventMock = {
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCardComponent],
      providers: [
        StringsService,
        {
          provide: STRINGS_LOADER,
          useValue: { load: () => Promise.resolve({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportCardComponent);
    component = fixture.componentInstance;
    component.event = testEvent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cardClick when onSelect is called', () => {
    const emitSpy = vi.spyOn(component.cardClick, 'emit');
    component.onSelect();
    expect(emitSpy).toHaveBeenCalledWith(testEvent);
  });
});