
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RecoverPassword } from './recover-password';

const es = {
  'auth.recovery.title': 'Recuperar contraseña',
  'auth.recovery.new': 'Nueva contraseña',
  'auth.recovery.confirm': 'Confirma la nueva contraseña',
  'auth.recovery.show': 'Mostrar contraseña',
  'auth.recovery.hide': 'Ocultar contraseña',
  'auth.recovery.match': 'Las contraseñas coinciden',
  'auth.recovery.mismatch': 'Las contraseñas no coinciden',
  'auth.recovery.submit': 'Recuperar contraseña',
};

const en = {
  'auth.recovery.title': 'Recover password',
  'auth.recovery.new': 'New password',
  'auth.recovery.confirm': 'Confirm new password',
  'auth.recovery.show': 'Show password',
  'auth.recovery.hide': 'Hide password',
  'auth.recovery.match': 'Passwords match',
  'auth.recovery.mismatch': 'Passwords do not match',
  'auth.recovery.submit': 'Recover password',
};

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
    element.dispatchEvent(
      new Event('input', { bubbles: true })
    );
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecoverPassword,
        TranslocoTestingModule.forRoot({
          langs: { es, en },
          translocoConfig: {
            availableLangs: ['es', 'en'],
            defaultLang: 'es',
            reRenderOnLangChange: true,
          },
          preloadLangs: true,
        }),
      ],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPassword);
    component = fixture.componentInstance;
    root = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render recovery title', () => {
    expect(root.querySelector('h1')).toBeTruthy();
    expect(root.querySelector('h1')?.textContent).toContain(
      'Recuperar contraseña'
    );
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

  it('should render translated form labels', () => {
    const labels = Array.from(
      root.querySelectorAll('label')
    ).map(label => label.textContent?.trim());

    expect(labels).toContain('Nueva contraseña');
    expect(labels).toContain('Confirma la nueva contraseña');

    expect(button('recovery-submit').textContent).toContain(
      'Recuperar contraseña'
    );
  });
});
