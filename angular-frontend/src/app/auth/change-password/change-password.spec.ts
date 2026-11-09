
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub } from '@testutils/stubs';
import { ChangePassword } from './change-password';
import { vi } from 'vitest';

describe('UH-46 Change Password', () => {
  let fixture: ComponentFixture<ChangePassword>;
  let component: ChangePassword;
  let root: HTMLElement;

  const input = (id: string): HTMLInputElement =>
    root.querySelector<HTMLInputElement>(
      `[data-testid="${id}"]`
    )!;

  const button = (id: string): HTMLButtonElement =>
    root.querySelector<HTMLButtonElement>(
      `[data-testid="${id}"]`
    )!;

  const typeInto = (id: string, value: string): void => {
    const element = input(id);
    element.value = value;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  const click = (id: string): void => {
    button(id).click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePassword],
      providers: [
        provideRouter([]),
        {
          provide: StringsService,
          useClass: StringsServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassword);
    component = fixture.componentInstance;
    root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render three password fields', () => {
    expect(input('current-password')).toBeTruthy();
    expect(input('new-password')).toBeTruthy();
    expect(input('confirm-password')).toBeTruthy();
  });

  it('should hide all passwords initially', () => {
    expect(input('current-password').type).toBe('password');
    expect(input('new-password').type).toBe('password');
    expect(input('confirm-password').type).toBe('password');
  });

  it('should show and hide current password', () => {
    click('toggle-current-password');
    expect(input('current-password').type).toBe('text');

    click('toggle-current-password');
    expect(input('current-password').type).toBe('password');
  });

  it('should show and hide new password', () => {
    click('toggle-new-password');
    expect(input('new-password').type).toBe('text');

    click('toggle-new-password');
    expect(input('new-password').type).toBe('password');
  });

  it('should show and hide confirm password', () => {
    click('toggle-confirm-password');
    expect(input('confirm-password').type).toBe('text');

    click('toggle-confirm-password');
    expect(input('confirm-password').type).toBe('password');
  });

  it('should keep other password fields unchanged', () => {
    click('toggle-current-password');

    expect(input('current-password').type).toBe('text');
    expect(input('new-password').type).toBe('password');
    expect(input('confirm-password').type).toBe('password');
  });

  it('should show mismatch error when passwords differ', () => {
    typeInto('new-password', 'Nueva123!');
    typeInto('confirm-password', 'Otra123!');

    expect(
      root.querySelector('[data-testid="password-mismatch"]')
    ).toBeTruthy();

    expect(button('change-password-submit').disabled).toBe(true);
  });

  it('should show success indicator when passwords match', () => {
    typeInto('new-password', 'Nueva123!');
    typeInto('confirm-password', 'Nueva123!');

    expect(
      root.querySelector('[data-testid="password-match"]')
    ).toBeTruthy();
  });

  it('should disable submit when fields are empty', () => {
    expect(button('change-password-submit').disabled).toBe(true);
  });

  it('should disable submit when old and new password are equal', () => {
    typeInto('current-password', 'Igual123!');
    typeInto('new-password', 'Igual123!');
    typeInto('confirm-password', 'Igual123!');

    expect(button('change-password-submit').disabled).toBe(true);
  });

  it('should emit valid password values on submit', () => {
    const spy = vi.fn();

    component.passwordChangeRequested.subscribe(spy);

    typeInto('current-password', 'Anterior123!');
    typeInto('new-password', 'Nueva123!');
    typeInto('confirm-password', 'Nueva123!');

    click('change-password-submit');

    expect(spy).toHaveBeenCalledWith({
      currentPassword: 'Anterior123!',
      newPassword: 'Nueva123!',
    });
  });

  it('should render translated title key', () => {
    expect(root.querySelector('h1')?.textContent?.trim())
      .toBe('auth.changePassword.title');
  });
});
