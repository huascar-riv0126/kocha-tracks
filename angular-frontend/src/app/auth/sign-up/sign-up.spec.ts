import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { StringsServiceStub } from '@testutils/stubs';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { SignUp, SignUpPayload } from './sign-up';

describe('SignUp', () => {
  let fixture: ComponentFixture<SignUp>;
  let component: SignUp;
  let root: HTMLElement;

  const byTestId = <T extends Element = HTMLElement>(id: string): T | null =>
    root.querySelector<T>(`[data-testid="${id}"]`);

  const typeInto = (id: string, value: string): void => {
    const input = byTestId<HTMLInputElement>(id)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  const blur = (id: string): void => {
    byTestId<HTMLInputElement>(id)!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  };

  const click = (id: string): void => {
    byTestId<HTMLElement>(id)!.click();
    fixture.detectChanges();
  };

  const submitButton = (): HTMLButtonElement => byTestId<HTMLButtonElement>('signup-submit')!;

  const fillPasswords = (password = 'secreto123', confirm = password): void => {
    typeInto('signup-password', password);
    typeInto('signup-confirm', confirm);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [provideRouter([]), { provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title, the four fields and the terms checkbox', () => {
    expect(root.querySelector('h1')?.textContent?.trim()).toBe('auth.signup.title');
    expect(byTestId('signup-username')).toBeTruthy();
    expect(byTestId('signup-email')).toBeTruthy();
    expect(byTestId('signup-password')).toBeTruthy();
    expect(byTestId('signup-confirm')).toBeTruthy();
    expect(byTestId('signup-terms')).toBeTruthy();
  });

  it('should not show any validation error on first render', () => {
    expect(root.querySelectorAll('[role="alert"]').length).toBe(0);
  });

  describe('email field', () => {
    it('should show an error when the email is not valid', () => {
      typeInto('signup-email', 'correo-invalido');
      blur('signup-email');

      expect(byTestId('signup-email-error')?.textContent?.trim()).toBe(
        'auth.signup.error.email.invalid',
      );
    });

    it('should show the required error when the email is empty after leaving the field', () => {
      blur('signup-email');

      expect(byTestId('signup-email-error')?.textContent?.trim()).toBe(
        'auth.signup.error.email.required',
      );
    });

    it('should not show an error when the email is valid', () => {
      typeInto('signup-email', 'persona@example.com');
      blur('signup-email');

      expect(byTestId('signup-email-error')).toBeNull();
    });

    it('should paint the error message with the danger color', () => {
      typeInto('signup-email', 'correo-invalido');
      blur('signup-email');

      expect(byTestId('signup-email-error')?.classList.contains('text-status-danger-500')).toBe(
        true,
      );
    });
  });

  describe('password visibility toggle', () => {
    it('should hide the password and show the open eye by default', () => {
      expect(byTestId<HTMLInputElement>('signup-password')!.type).toBe('password');
      expect(byTestId('signup-eye-open')).toBeTruthy();
      expect(byTestId('signup-eye-off')).toBeNull();
    });

    it('should show the password as plain text and the crossed eye after clicking the open eye', () => {
      click('signup-password-toggle');

      expect(byTestId<HTMLInputElement>('signup-password')!.type).toBe('text');
      expect(byTestId('signup-eye-off')).toBeTruthy();
      expect(byTestId('signup-eye-open')).toBeNull();
    });

    it('should hide the password again after clicking the crossed eye', () => {
      click('signup-password-toggle');
      click('signup-password-toggle');

      expect(byTestId<HTMLInputElement>('signup-password')!.type).toBe('password');
      expect(byTestId('signup-eye-open')).toBeTruthy();
      expect(byTestId('signup-eye-off')).toBeNull();
    });

    it('should keep the confirm field hidden when the password is shown', () => {
      click('signup-password-toggle');

      expect(byTestId<HTMLInputElement>('signup-confirm')!.type).toBe('password');
    });
  });

  describe('confirm password field', () => {
    it('should not show any icon while it is empty', () => {
      expect(byTestId('signup-confirm-match')).toBeNull();
      expect(byTestId('signup-confirm-mismatch')).toBeNull();
    });

    it('should show the danger X icon when the passwords do not match', () => {
      fillPasswords('secreto123', 'otra-cosa');

      const icon = byTestId('signup-confirm-mismatch');
      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('text-status-danger-500')).toBe(true);
      expect(byTestId('signup-confirm-match')).toBeNull();
    });

    it('should show the success check icon when the passwords match', () => {
      fillPasswords('secreto123');

      const icon = byTestId('signup-confirm-match');
      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('text-status-success-500')).toBe(true);
      expect(byTestId('signup-confirm-mismatch')).toBeNull();
    });

    it('should switch back to the X icon if the password is changed afterwards', () => {
      fillPasswords('secreto123');
      typeInto('signup-password', 'cambiada');

      expect(byTestId('signup-confirm-mismatch')).toBeTruthy();
      expect(byTestId('signup-confirm-match')).toBeNull();
    });

    it('should show the mismatch error below the field after leaving it', () => {
      fillPasswords('secreto123', 'otra-cosa');
      blur('signup-confirm');

      expect(byTestId('signup-confirm-error')?.textContent?.trim()).toBe(
        'auth.signup.error.confirm.mismatch',
      );
    });
  });

  describe('create account button', () => {
    it('should be disabled initially', () => {
      expect(submitButton().disabled).toBe(true);
    });

    it('should stay disabled when the passwords match but the terms are not accepted', () => {
      fillPasswords('secreto123');

      expect(submitButton().disabled).toBe(true);
    });

    it('should stay disabled when the terms are accepted but the passwords do not match', () => {
      fillPasswords('secreto123', 'otra-cosa');
      click('signup-terms');

      expect(submitButton().disabled).toBe(true);
    });

    it('should stay disabled when the terms are accepted but the passwords are empty', () => {
      click('signup-terms');

      expect(submitButton().disabled).toBe(true);
    });

    it('should be enabled when the passwords match and the terms are accepted', () => {
      fillPasswords('secreto123');
      click('signup-terms');

      expect(submitButton().disabled).toBe(false);
    });

    it('should be disabled again when the terms are unchecked', () => {
      fillPasswords('secreto123');
      click('signup-terms');
      click('signup-terms');

      expect(submitButton().disabled).toBe(true);
    });
  });

  describe('validation errors on submit', () => {
    it('should show an error below each incomplete field and not emit the form', () => {
      const emitted = vi.fn();
      component.signUp.subscribe(emitted);

      fillPasswords('secreto123');
      click('signup-terms');
      click('signup-submit');

      expect(byTestId('signup-username-error')?.textContent?.trim()).toBe(
        'auth.signup.error.username.required',
      );
      expect(byTestId('signup-email-error')?.textContent?.trim()).toBe(
        'auth.signup.error.email.required',
      );
      expect(emitted).not.toHaveBeenCalled();
    });

    it('should emit the form data when everything is valid', () => {
      const emitted = vi.fn<(payload: SignUpPayload) => void>();
      component.signUp.subscribe(emitted);

      typeInto('signup-username', 'Junpi7489');
      typeInto('signup-email', 'junpi@example.com');
      fillPasswords('secreto123');
      click('signup-terms');
      click('signup-submit');

      expect(emitted).toHaveBeenCalledTimes(1);
      expect(emitted).toHaveBeenCalledWith({
        username: 'Junpi7489',
        email: 'junpi@example.com',
        password: 'secreto123',
      });
    });
  });

  it('should link to the login page', () => {
    const link = byTestId<HTMLAnchorElement>('signup-login-link');

    expect(link?.getAttribute('href')).toBe('/login');
  });
});