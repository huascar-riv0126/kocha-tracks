
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { Login } from './login';

describe('FIX-02 - Login UI/UX', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  // FUNCIONES AUXILIARES

  function getEmailInput(): HTMLInputElement {
    return compiled.querySelector(
      '#email'
    ) as HTMLInputElement;
  }

  function getPasswordInput(): HTMLInputElement {
    return compiled.querySelector(
      '#password'
    ) as HTMLInputElement;
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

  // ==================================
  // 7 PRUEBAS EXISTENTES DE RENDERIZADO
  // ==================================

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the login title', () => {
    const title = compiled.querySelector('h1');

    expect(title).toBeTruthy();

    expect(
      title?.textContent?.trim()
    ).toBe('Inicio de sesión');
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

    const forgotPasswordLink = links.find(
      link => link.textContent?.includes(
        '¿Olvidaste tu contraseña?'
      )
    );

    expect(forgotPasswordLink).toBeTruthy();
  });

  it('should render the login button', () => {
    const button = getSubmitButton();

    expect(button).toBeTruthy();

    expect(
      button.textContent?.trim()
    ).toBe('Iniciar sesión');
  });

  it('should render the create account link', () => {
    const links = Array.from(
      compiled.querySelectorAll('a')
    );

    const createAccountLink = links.find(
      link => link.textContent?.includes(
        'Crear cuenta'
      )
    );

    expect(createAccountLink).toBeTruthy();
  });

  // ==================================
  // PRUEBAS DE VISIBILIDAD
  // ==================================

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
      compiled.querySelector(
        '[data-testid="eye-open-icon"]'
      )
    ).toBeTruthy();

    getToggleButton().click();
    fixture.detectChanges();

    expect(
      compiled.querySelector(
        '[data-testid="eye-closed-icon"]'
      )
    ).toBeTruthy();

    expect(
      compiled.querySelector(
        '[data-testid="eye-open-icon"]'
      )
    ).toBeNull();
  });

  it('should restore original eye icon when hidden', () => {
    getToggleButton().click();
    fixture.detectChanges();

    getToggleButton().click();
    fixture.detectChanges();

    expect(
      compiled.querySelector(
        '[data-testid="eye-open-icon"]'
      )
    ).toBeTruthy();

    expect(
      compiled.querySelector(
        '[data-testid="eye-closed-icon"]'
      )
    ).toBeNull();
  });

  // ==================================
  // PRUEBAS DE VALIDACION DEL CORREO
  // ==================================

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

    getEmailInput().dispatchEvent(
      new Event('blur')
    );

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
    getEmailInput().dispatchEvent(
      new Event('blur')
    );

    fixture.detectChanges();

    expect(component.emailRequired()).toBe(true);

    const error = compiled.querySelector(
      '[data-testid="login-email-error"]'
    );

    expect(error?.textContent).toContain(
      'El correo electrónico es obligatorio'
    );
  });

  // ==================================
  // PRUEBAS DE FORMULARIO
  // ==================================

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
});
