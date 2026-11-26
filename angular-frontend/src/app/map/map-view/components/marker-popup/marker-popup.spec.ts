import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MarkerPopupComponent } from './marker-popup';
import { StringsService } from '../../../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../../../core/strings/strings-token';

const event = {
  id: 7,
  title: 'Evento X',
  state: 'activo',
  coordinates: [-17.38, -66.15],
  location: 'Centro de Convenciones',
  sourceName: 'Tránsito Cochabamba',
} as any;

describe('MarkerPopupComponent', () => {
  let component: MarkerPopupComponent;
  let fixture: ComponentFixture<MarkerPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarkerPopupComponent],
      providers: [
        StringsService,
        { provide: STRINGS_LOADER, useValue: { load: () => Promise.resolve({}) } },
      ],
    });

    fixture = TestBed.createComponent(MarkerPopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('event', event);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.markerColor()).toBe('#ef4444');
  });

  it('should render the event title and details button', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Evento X');
    const btn = el.querySelector('.btn-detalles') as HTMLElement;
    expect(btn).toBeTruthy();
  });

  it('should emit the event id when details button is clicked', () => {
    const emitSpy = vi.spyOn(component.details, 'emit');
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    (el.querySelector('.btn-detalles') as HTMLElement).click();
    expect(emitSpy).toHaveBeenCalledWith(7);
  });
});
