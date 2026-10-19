import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the login title', () => {
    const compiled =
      fixture.nativeElement as HTMLElement;

    const title =
      compiled.querySelector('h1');

    expect(title).toBeTruthy();

    expect(
      title?.textContent?.trim()
    ).toBe('Inicio de sesión');
  });

  it('should render the email input', () => {
    const compiled =
      fixture.nativeElement as HTMLElement;

    const emailInput =
      compiled.querySelector('#email');

    expect(emailInput).toBeTruthy();
  });

  it('should render the password input', () => {
    const compiled =
      fixture.nativeElement as HTMLElement;

    const passwordInput =
      compiled.querySelector('#password');

    expect(passwordInput).toBeTruthy();
  });

  it('should render the forgot password link', () => {
    const compiled =
      fixture.nativeElement as HTMLElement;

    const links =
      Array.from(
        compiled.querySelectorAll('a')
      );

    const forgotPasswordLink =
      links.find(link =>
        link.textContent
          ?.includes('¿Olvidaste tu contraseña?')
      );

    expect(forgotPasswordLink).toBeTruthy();
  });

  it('should render the login button', () => {
    const compiled =
      fixture.nativeElement as HTMLElement;

    const button =
      compiled.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;

    expect(button).toBeTruthy();

    expect(
      button.textContent?.trim()
    ).toBe('Iniciar sesión');
  });

  it('should render the create account link', () => {
    const compiled =
      fixture.nativeElement as HTMLElement;

    const links =
      Array.from(
        compiled.querySelectorAll('a')
      );

    const createAccountLink =
      links.find(link =>
        link.textContent
          ?.includes('Crear cuenta')
      );

    expect(createAccountLink).toBeTruthy();
  });
});