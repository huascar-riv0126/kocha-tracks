
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

  const emailInput = (): HTMLInputElement =>
    root.querySelector<HTMLInputElement>(
      '[data-testid="recovery-email"]'
    )!;

  const submitButton = (): HTMLButtonElement =>
    root.querySelector<HTMLButtonElement>(
      '[data-testid="recovery-submit"]'
    )!;

  const typeEmail = (value: string): void => {
    const input = emailInput();
    input.value = value;
    input.dispatchEvent(new Event('input'));
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
    root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create the recovery component', () => {
    expect(component).toBeTruthy();
  });

  it('should render recovery title', () => {
    expect(root.querySelector('h1')).toBeTruthy();
  });

  it('should render email input', () => {
    expect(emailInput()).toBeTruthy();
    expect(emailInput().type).toBe('email');
  });

  it('should disable submit initially', () => {
    expect(submitButton().disabled).toBe(true);
  });

  it('should reject empty email', () => {
    emailInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.emailError())
      .toBe('auth.recovery.error.required');

    expect(submitButton().disabled).toBe(true);
  });

  it('should reject invalid email', () => {
    typeEmail('correo-invalido');
    emailInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.emailValid()).toBe(false);
    expect(component.emailError())
      .toBe('auth.recovery.error.invalid');
  });

  it('should accept valid email', () => {
    typeEmail('usuario@example.com');

    expect(component.emailValid()).toBe(true);
    expect(submitButton().disabled).toBe(false);
  });

  it('should remove error after correcting email', () => {
    typeEmail('incorrecto');
    emailInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.emailError()).not.toBeNull();

    typeEmail('correcto@example.com');

    expect(component.emailError()).toBeNull();
  });

  it('should emit trimmed email on valid submit', () => {
    const spy = vi.fn();

    component.recoveryRequested.subscribe(spy);

    typeEmail('  usuario@example.com  ');
    submitButton().click();

    expect(spy).toHaveBeenCalledWith({
      email: 'usuario@example.com',
    });
  });

  it('should not emit invalid email', () => {
    const spy = vi.fn();

    component.recoveryRequested.subscribe(spy);

    typeEmail('correo-invalido');

    root.querySelector('form')!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it('should disable submit while submitting', () => {
    typeEmail('usuario@example.com');

    component.isSubmitting.set(true);
    fixture.detectChanges();

    expect(submitButton().disabled).toBe(true);
  });

  it('should render link back to login', () => {
    const link = root.querySelector<HTMLAnchorElement>(
      '[data-testid="back-to-login"]'
    );

    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/login');
  });
});
