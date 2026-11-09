
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  TranslocoService,
  TranslocoTestingModule,
} from '@jsverse/transloco';
import { vi } from 'vitest';

import { Login } from './login';

const es = {
  brand: 'Kocha Tracks',
  'auth.login.title': 'Inicio de sesión',
  'auth.login.email.label': 'Correo electrónico',
  'auth.login.email.placeholder': 'name@example.com',
  'auth.login.password.label': 'Contraseña',
  'auth.login.password.placeholder': '••••••••',
  'auth.login.password.show': 'Mostrar contraseña',
  'auth.login.password.hide': 'Ocultar contraseña',
  'auth.login.error.email.required':
    'El correo electrónico es obligatorio.',
  'auth.login.error.email.invalid':
    'Ingresa un correo electrónico válido.',
  'auth.login.error.password.required':
    'La contraseña es obligatoria.',
  'auth.login.forgotPassword': '¿Olvidaste tu contraseña?',
  'auth.login.submit': 'Iniciar sesión',
  'auth.login.noAccount': '¿No tienes una cuenta?',
  'auth.login.createAccount': 'Crear cuenta',
};

const en = {
  brand: 'Kocha Tracks',
  'auth.login.title': 'Log in',
  'auth.login.email.label': 'Email address',
  'auth.login.email.placeholder': 'name@example.com',
  'auth.login.password.label': 'Password',
  'auth.login.password.placeholder': '••••••••',
  'auth.login.password.show': 'Show password',
  'auth.login.password.hide': 'Hide password',
  'auth.login.error.email.required':
    'Email address is required.',
  'auth.login.error.email.invalid':
    'Enter a valid email address.',
  'auth.login.error.password.required':
    'Password is required.',
  'auth.login.forgotPassword': 'Forgot your password?',
  'auth.login.submit': 'Log in',
  'auth.login.noAccount': "Don't have an account?",
  'auth.login.createAccount': 'Create account',
};

describe('FIX-02 - Login UI/UX', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Login,
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

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  function getEmailInput(): HTMLInputElement {
    return compiled.querySelector('#email') as HTMLInputElement;
  }

  function getPasswordInput(): HTMLInputElement {
    return compiled.querySelector('#password') as HTMLInputElement;
  }

  function getToggleButton(): HTMLButtonElement {
    return compiled.querySelector(
      '[data-testid="login-toggle-password"]'
    ) as HTMLButtonElement;
  }

  function getSubmitButton(): HTMLButtonElement {
    return compiled.querySelector(
      '[data-testid="login-submit"]'
    ) as HTMLButtonElement;
  }

  function setEmail(value: string): void {
    const input = getEmailInput();
    input.value = value;
    input.dispatchEvent(
      new Event('input', { bubbles: true })
    );
    fixture.detectChanges();
  }

  function setPassword(value: string): void {
    const input = getPasswordInput();
    input.value = value;
    input.dispatchEvent(
      new Event('input', { bubbles: true })
    );
    fixture.detectChanges();
  }

  function submitForm(): void {
    const form = compiled.querySelector(
      'form'
    ) as HTMLFormElement;

    form.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      })
    );

    fixture.detectChanges();
  }

  // PRUEBAS DE RENDERIZADO

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the login title', () => {
    const title = compiled.querySelector('h1');
    expect(title).toBeTruthy();
    expect(title?.textContent?.trim()).toBe('Inicio de sesión');
  });

  it('should render the email input', () => {
    expect(getEmailInput()).toBeTruthy();
  });

  it('should render the password input', () => {
    expect(getPasswordInput()).toBeTruthy();
  });

  it('should render the forgot password link', () => {
    const links = Array.from(
      compiled.querySelectorAll('a')
    );

    const link = links.find(item =>
      item.textContent?.includes('¿Olvidaste tu contraseña?')
    );

    expect(link).toBeTruthy();
  });

  it('should render the login button', () => {
    const button = getSubmitButton();
    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toBe('Iniciar sesión');
  });

  it('should render the create account link', () => {
    const links = Array.from(
      compiled.querySelectorAll('a')
    );

    const link = links.find(item =>
      item.textContent?.includes('Crear cuenta')
    );

    expect(link).toBeTruthy();
  });

  // PRUEBAS DE VISIBILIDAD DE CONTRASEÑA

  it('should hide password by default', () => {
    expect(getPasswordInput().type).toBe('password');
    expect(component.showPassword()).toBe(false);
  });

  it('should show password when eye is clicked', () => {
    getToggleButton().click();
    fixture.detectChanges();

    expect(getPasswordInput().type).toBe('text');
    expect(component.showPassword()).toBe(true);
  });

  it('should hide password after clicking eye twice', () => {
    getToggleButton().click();
    fixture.detectChanges();

    getToggleButton().click();
    fixture.detectChanges();

    expect(getPasswordInput().type).toBe('password');
    expect(component.showPassword()).toBe(false);
  });

  it('should change eye icon when password is visible', () => {
    expect(
      compiled.querySelector('[data-testid="eye-open-icon"]')
    ).toBeTruthy();

    getToggleButton().click();
    fixture.detectChanges();

    expect(
      compiled.querySelector('[data-testid="eye-closed-icon"]')
    ).toBeTruthy();

    expect(
      compiled.querySelector('[data-testid="eye-open-icon"]')
    ).toBeNull();
  });

  it('should restore original eye icon when hidden', () => {
    getToggleButton().click();
    fixture.detectChanges();

    getToggleButton().click();
    fixture.detectChanges();

    expect(
      compiled.querySelector('[data-testid="eye-open-icon"]')
    ).toBeTruthy();

    expect(
      compiled.querySelector('[data-testid="eye-closed-icon"]')
    ).toBeNull();
  });

  // VALIDACIÓN DEL CORREO

  it('should accept a valid email', () => {
    setEmail('usuario@gmail.com');

    expect(component.email()).toBe('usuario@gmail.com');
    expect(component.emailValid()).toBe(true);
    expect(component.emailInvalid()).toBe(false);
  });

  it('should reject an invalid email', () => {
    setEmail('correo-invalido');

    expect(component.emailValid()).toBe(false);
    expect(component.emailInvalid()).toBe(true);
  });

  it('should show email error after blur', () => {
    setEmail('correo-invalido');

    getEmailInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const error = compiled.querySelector(
      '[data-testid="login-email-error"]'
    );

    expect(error).toBeTruthy();
    expect(error?.textContent).toContain(
      'Ingresa un correo electrónico válido'
    );
  });

  it('should detect a required email', () => {
    getEmailInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.emailRequired()).toBe(true);

    const error = compiled.querySelector(
      '[data-testid="login-email-error"]'
    );

    expect(error?.textContent).toContain(
      'El correo electrónico es obligatorio'
    );
  });

  // VALIDACIÓN Y ENVÍO DEL FORMULARIO

  it('should disable submit with empty fields', () => {
    expect(component.canSubmit()).toBe(false);
    expect(getSubmitButton().disabled).toBe(true);
  });

  it('should disable submit when email is invalid', () => {
    setEmail('correo-invalido');
    setPassword('Clave123!');

    expect(component.canSubmit()).toBe(false);
    expect(getSubmitButton().disabled).toBe(true);
  });

  it('should enable submit with valid credentials', () => {
    setEmail('usuario@gmail.com');
    setPassword('Clave123!');

    expect(component.canSubmit()).toBe(true);
    expect(getSubmitButton().disabled).toBe(false);
  });

  it('should call onSubmit when valid form is submitted', () => {
    setEmail('usuario@gmail.com');
    setPassword('Clave123!');

    const spy = vi.spyOn(component, 'onSubmit');

    submitForm();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit credentials on valid submission', () => {
    const spy = vi.fn();
    component.loginRequested.subscribe(spy);

    setEmail('usuario@gmail.com');
    setPassword('Clave123!');

    submitForm();

    expect(spy).toHaveBeenCalledWith({
      email: 'usuario@gmail.com',
      password: 'Clave123!',
    });
  });

  it('should not emit credentials when form is invalid', () => {
    const spy = vi.fn();
    component.loginRequested.subscribe(spy);

    setEmail('correo-invalido');
    setPassword('Clave123!');

    submitForm();

    expect(spy).not.toHaveBeenCalled();
    expect(component.submitted()).toBe(true);
  });

  // NUEVAS PRUEBAS DE TRANSL OCO

  it('should render translated Login labels in Spanish', () => {
    expect(compiled.querySelector('h1')?.textContent?.trim())
      .toBe('Inicio de sesión');

    expect(
      compiled.querySelector('label[for="email"]')
        ?.textContent?.trim()
    ).toBe('Correo electrónico');

    expect(
      compiled.querySelector('label[for="password"]')
        ?.textContent?.trim()
    ).toBe('Contraseña');
  });

  it('should translate Login interface to English', async () => {
    TestBed.inject(TranslocoService).setActiveLang('en');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('h1')?.textContent?.trim())
      .toBe('Log in');

    expect(
      compiled.querySelector('label[for="email"]')
        ?.textContent?.trim()
    ).toBe('Email address');

    expect(
      compiled.querySelector('label[for="password"]')
        ?.textContent?.trim()
    ).toBe('Password');

    expect(getSubmitButton().textContent?.trim())
      .toBe('Log in');
  });
});
