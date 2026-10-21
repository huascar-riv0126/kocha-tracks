import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the register title', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('h1')?.textContent?.trim()
    ).toBe('Crea una cuenta');
  });

  it('should render username input', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('#username')
    ).toBeTruthy();
  });

  it('should render email input', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('#email')
    ).toBeTruthy();
  });

  it('should render password input', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('#password')
    ).toBeTruthy();
  });

  it('should render confirm password input', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('#confirmPassword')
    ).toBeTruthy();
  });

  it('should render terms checkbox', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('input[type="checkbox"]')
    ).toBeTruthy();
  });

  it('should render create account button', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const button = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    expect(button).toBeTruthy();

    expect(
      button.textContent?.trim()
    ).toBe('Crear cuenta');
  });

  it('should render login link', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const links = Array.from(
      compiled.querySelectorAll('a')
    );

    const loginLink = links.find(link =>
      link.textContent?.includes('Iniciar sesión')
    );

    expect(loginLink).toBeTruthy();
  });
});