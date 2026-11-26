import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ZoneUndoButtonComponent } from './zone-undo-button';
import { StringsService } from '../../../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../../../core/strings/strings-token';

describe('ZoneUndoButtonComponent', () => {
  let component: ZoneUndoButtonComponent;
  let fixture: ComponentFixture<ZoneUndoButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ZoneUndoButtonComponent],
      providers: [
        StringsService,
        { provide: STRINGS_LOADER, useValue: { load: () => Promise.resolve({}) } },
      ],
    });

    fixture = TestBed.createComponent(ZoneUndoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the undo button', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const btn = el.querySelector('.zone-undo-btn') as HTMLElement;
    expect(btn).toBeTruthy();
  });

  it('should emit undo when the button is clicked', () => {
    const emitSpy = vi.spyOn(component.undo, 'emit');
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    (el.querySelector('.zone-undo-btn') as HTMLElement).click();
    expect(emitSpy).toHaveBeenCalled();
  });
});
