import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ReportCardComponent } from './report-card';
import { StringsService } from '../../../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../../../core/strings/strings-token';
import { EventMock } from '../../../../event/event-mock.model';

describe('ReportCardComponent', () => {
  let component: ReportCardComponent;
  let fixture: ComponentFixture<ReportCardComponent>;

  const mockEvent: EventMock = {
    id: 1,
    title: 'Bloqueo - Av. Blanco Galindo',
    state: 'activo',
    elapsedTime: '15 min',
    coordinates: [-17.38, -66.15],
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
    component.event = mockEvent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cardClick when onSelect is called', () => {
    const emitSpy = vi.spyOn(component.cardClick, 'emit');
    component.onSelect();
    expect(emitSpy).toHaveBeenCalledWith(mockEvent);
  });
});