
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RecoverPassword } from './recover-password';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';

describe('UH-47 Recover Password', () => {
  let component: RecoverPassword;
  let fixture: ComponentFixture<RecoverPassword>;
  let root: HTMLElement;

  const input = (testId: string): HTMLInputElement =>
    root.querySelector<HTMLInputElement>(
      `[data-testid="${testId}"]`
    )!;

  const button = (testId: string): HTMLButtonElement =>
    root.querySelector<HTMLButtonElement>(
      `[data-testid="${testId}"]`
    )!;

  const write = (testId: string, value: string): void => {
    const element = input(testId);
    element.value = value;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverPassword],
      providers: [
        provideRouter([]),
        {
          provide: StringsService,
          useClass: StringsServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPassword);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render recovery title', () => {
    expect(root.querySelector('h1')).toBeTruthy();
  });

  it('should render two password fields', () => {
    expect(input('recovery-new-password')).toBeTruthy();
    expect(input('recovery-confirm-password')).toBeTruthy();
  });

  it('should hide passwords initially', () => {
    expect(input('recovery-new-password').type).toBe('password');
    expect(input('recovery-confirm-password').type).toBe('password');
  });

  it('should show and hide new password', () => {
    button('toggle-recovery-new-password').click();
    fixture.detectChanges();

    expect(input('recovery-new-password').type).toBe('text');

    button('toggle-recovery-new-password').click();
    fixture.detectChanges();

    expect(input('recovery-new-password').type).toBe('password');
  });

  it('should show and hide confirm password', () => {
    button('toggle-recovery-confirm-password').click();
    fixture.detectChanges();

    expect(input('recovery-confirm-password').type).toBe('text');

    button('toggle-recovery-confirm-password').click();
    fixture.detectChanges();

    expect(input('recovery-confirm-password').type).toBe('password');
  });

  it('should keep password toggles independent', () => {
    button('toggle-recovery-new-password').click();
    fixture.detectChanges();

    expect(input('recovery-new-password').type).toBe('text');
    expect(input('recovery-confirm-password').type).toBe('password');
  });

  it('should disable submit with empty fields', () => {
    expect(button('recovery-submit').disabled).toBe(true);
  });

  it('should detect matching passwords', () => {
    write('recovery-new-password', 'Clave123!');
    write('recovery-confirm-password', 'Clave123!');

    expect(component.passwordsMatch()).toBe(true);
    expect(
      root.querySelector('[data-testid="recovery-password-match"]')
    ).toBeTruthy();
  });

  it('should detect mismatching passwords', () => {
    write('recovery-new-password', 'Clave123!');
    write('recovery-confirm-password', 'OtraClave123!');

    expect(component.passwordsMismatch()).toBe(true);
    expect(
      root.querySelector('[data-testid="recovery-password-mismatch"]')
    ).toBeTruthy();
  });

  it('should disable submit when passwords differ', () => {
    write('recovery-new-password', 'Clave123!');
    write('recovery-confirm-password', 'OtraClave123!');

    expect(button('recovery-submit').disabled).toBe(true);
  });

  it('should enable submit when passwords match', () => {
    write('recovery-new-password', 'Clave123!');
    write('recovery-confirm-password', 'Clave123!');

    expect(button('recovery-submit').disabled).toBe(false);
  });

  it('should emit new password on valid submit', () => {
    const spy = vi.fn();
    component.recoveryRequested.subscribe(spy);

    write('recovery-new-password', 'Clave123!');
    write('recovery-confirm-password', 'Clave123!');

    button('recovery-submit').click();

    expect(spy).toHaveBeenCalledWith({
      newPassword: 'Clave123!',
    });
  });

  it('should not emit when passwords do not match', () => {
    const spy = vi.fn();
    component.recoveryRequested.subscribe(spy);

    write('recovery-new-password', 'Clave123!');
    write('recovery-confirm-password', 'Incorrecta123!');

    root.querySelector('form')!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(spy).not.toHaveBeenCalled();
  });
});
