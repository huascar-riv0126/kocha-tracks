import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { StringsServiceStub } from '@testutils/stubs';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { SignUp, SignUpPayload } from './sign-up';

/**
 * UH-22.2 - Sign-Up form component.
 * Each `describe` block maps to one requirement of the user story.
 * Texts are rendered as translation keys because StringsServiceStub returns the key itself.
 */
describe('UH-22.2 Sign-Up form', () => {
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

  const errorText = (id: string): string | undefined => byTestId(id)?.textContent?.trim();

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

  describe('Rendering', () => {
    it('creates the component', () => {
      expect(component).toBeTruthy();
    });

    it('renders the title, the four fields and the terms checkbox', () => {
      expect(root.querySelector('h1')?.textContent?.trim()).toBe('auth.signup.title');
      expect(byTestId('signup-username')).toBeTruthy();
      expect(byTestId('signup-email')).toBeTruthy();
      expect(byTestId('signup-password')).toBeTruthy();
      expect(byTestId('signup-confirm')).toBeTruthy();
      expect(byTestId('signup-terms')).toBeTruthy();
    });

    it('does not show any validation error on first render', () => {
      expect(root.querySelectorAll('[role="alert"]').length).toBe(0);
    });

    it('links to the login page', () => {
      expect(byTestId<HTMLAnchorElement>('signup-login-link')?.getAttribute('href')).toBe('/login');
    });
  });

  describe('Email field: validates that a valid email is entered', () => {
    it.each(['plainaddress', 'missing@tld', '@no-user.com', 'two@@example.com', 'spaces in@example.com'])(
      'rejects the invalid email "%s"',
      (value) => {
        typeInto('signup-email', value);
        blur('signup-email');

        expect(errorText('signup-email-error')).toBe('auth.signup.error.email.invalid');
      },
    );

    it.each(['user@example.com', 'first.last@sub.domain.org', 'user+tag@example.co'])(
      'accepts the valid email "%s"',
      (value) => {
        typeInto('signup-email', value);
        blur('signup-email');

        expect(byTestId('signup-email-error')).toBeNull();
      },
    );

    it('shows the required error when the email is left empty', () => {
      blur('signup-email');

      expect(errorText('signup-email-error')).toBe('auth.signup.error.email.required');
    });

    it('removes the error once the email is corrected', () => {
      typeInto('signup-email', 'correo-invalido');
      blur('signup-email');
      expect(byTestId('signup-email-error')).toBeTruthy();

      typeInto('signup-email', 'persona@example.com');

      expect(byTestId('signup-email-error')).toBeNull();
    });
  });

  describe('Password field: eye icon shows and hides the password', () => {
    it('hides the password with dots and shows the open eye by default', () => {
      expect(byTestId<HTMLInputElement>('signup-password')!.type).toBe('password');
      expect(byTestId('signup-eye-open')).toBeTruthy();
      expect(byTestId('signup-eye-off')).toBeNull();
    });

    it('shows the password as plain text and swaps to the crossed eye when the open eye is clicked', () => {
      click('signup-password-toggle');

      expect(byTestId<HTMLInputElement>('signup-password')!.type).toBe('text');
      expect(byTestId('signup-eye-off')).toBeTruthy();
      expect(byTestId('signup-eye-open')).toBeNull();
    });

    it('hides the password again and swaps back to the open eye when the crossed eye is clicked', () => {
      click('signup-password-toggle');
      click('signup-password-toggle');

      expect(byTestId<HTMLInputElement>('signup-password')!.type).toBe('password');
      expect(byTestId('signup-eye-open')).toBeTruthy();
      expect(byTestId('signup-eye-off')).toBeNull();
    });

    it('keeps the confirm field hidden when the password is shown', () => {
      click('signup-password-toggle');

      expect(byTestId<HTMLInputElement>('signup-confirm')!.type).toBe('password');
    });

    it('shows the required error when the password is left empty', () => {
      blur('signup-password');

      expect(errorText('signup-password-error')).toBe('auth.signup.error.password.required');
    });
  });

  describe('Confirm password field: must match the password', () => {
    it('shows no icon while it is empty', () => {
      expect(byTestId('signup-confirm-match')).toBeNull();
      expect(byTestId('signup-confirm-mismatch')).toBeNull();
    });

    it('shows the X icon in danger-500 when the passwords do not match', () => {
      fillPasswords('secreto123', 'otra-cosa');

      const icon = byTestId('signup-confirm-mismatch');
      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('text-status-danger-500')).toBe(true);
      expect(byTestId('signup-confirm-match')).toBeNull();
    });

    it('shows the check icon in success-500 when the passwords match', () => {
      fillPasswords('secreto123');

      const icon = byTestId('signup-confirm-match');
      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('text-status-success-500')).toBe(true);
      expect(byTestId('signup-confirm-mismatch')).toBeNull();
    });

    it('switches back to the X icon if the password is changed afterwards', () => {
      fillPasswords('secreto123');
      typeInto('signup-password', 'cambiada');

      expect(byTestId('signup-confirm-mismatch')).toBeTruthy();
      expect(byTestId('signup-confirm-match')).toBeNull();
    });

    it('shows the mismatch error below the field after leaving it', () => {
      fillPasswords('secreto123', 'otra-cosa');
      blur('signup-confirm');

      expect(errorText('signup-confirm-error')).toBe('auth.signup.error.confirm.mismatch');
    });

    it('shows the required error when it is left empty', () => {
      blur('signup-confirm');

      expect(errorText('signup-confirm-error')).toBe('auth.signup.error.confirm.required');
    });
  });

  describe('Create account button: disabled until passwords match and terms are accepted', () => {
    it('is disabled initially', () => {
      expect(submitButton().disabled).toBe(true);
    });

    it('stays disabled when the passwords match but the terms are not accepted', () => {
      fillPasswords('secreto123');

      expect(submitButton().disabled).toBe(true);
    });

    it('stays disabled when the terms are accepted but the passwords do not match', () => {
      fillPasswords('secreto123', 'otra-cosa');
      click('signup-terms');

      expect(submitButton().disabled).toBe(true);
    });

    it('stays disabled when the terms are accepted but the passwords are empty', () => {
      click('signup-terms');

      expect(submitButton().disabled).toBe(true);
    });

    it('is enabled when the passwords match and the terms are accepted', () => {
      fillPasswords('secreto123');
      click('signup-terms');

      expect(submitButton().disabled).toBe(false);
    });

    it('is disabled again when the terms are unchecked', () => {
      fillPasswords('secreto123');
      click('signup-terms');
      click('signup-terms');

      expect(submitButton().disabled).toBe(true);
    });

    it('shows the terms error when the checkbox is unchecked after being checked', () => {
      click('signup-terms');
      click('signup-terms');

      expect(errorText('signup-terms-error')).toBe('auth.signup.error.terms.required');
    });
  });

  describe('Validation errors: shown below the incorrect field in danger-500', () => {
    it('shows an error below each incomplete field and does not emit the form', () => {
      const emitted = vi.fn();
      component.signUp.subscribe(emitted);

      fillPasswords('secreto123');
      click('signup-terms');
      click('signup-submit');

      expect(errorText('signup-username-error')).toBe('auth.signup.error.username.required');
      expect(errorText('signup-email-error')).toBe('auth.signup.error.email.required');
      expect(emitted).not.toHaveBeenCalled();
    });

    it('places the error message after its input in the same field container', () => {
      blur('signup-email');

      const input = byTestId('signup-email')!;
      const error = byTestId('signup-email-error')!;

      expect(error.parentElement).toBe(input.parentElement);
      expect(input.compareDocumentPosition(error) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('paints the error message with the danger-500 color', () => {
      blur('signup-email');

      expect(byTestId('signup-email-error')?.classList.contains('text-status-danger-500')).toBe(
        true,
      );
    });

    it('emits the form data when everything is valid', () => {
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

  describe('Styling: Tailwind 4 classes and color variables', () => {
    it('does not use inline styles', () => {
      expect(root.querySelectorAll('[style]').length).toBe(0);
    });

    it('uses the interactive-cta color variable on the submit button', () => {
      expect(submitButton().classList.contains('bg-interactive-cta')).toBe(true);
    });
  });
});