import { Component, computed, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { BrandComponent } from '../../shared/brand/brand';
import { UserService } from '../../user/user-service';
import { Router } from '@angular/router';

export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

type Field = 'username' | 'email' | 'password' | 'confirmPassword' | 'terms';

const ALL_FIELDS: readonly Field[] = ['username', 'email', 'password', 'confirmPassword', 'terms'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, GetStringsPipe, BrandComponent],
  templateUrl: './sign-up.html',
})
export class SignUp {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  readonly registerError = signal<string | null>(null);

  readonly signUp = output<SignUpPayload>();

  readonly username = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly confirmPassword = signal('');
  readonly termsAccepted = signal(false);
  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly showSuccessModal = signal(false);

  private readonly touched = signal<ReadonlySet<Field>>(new Set());

  readonly passwordsMatch = computed(
    () => this.password().length > 0 && this.password() === this.confirmPassword(),
  );

  readonly confirmStatus = computed<'match' | 'mismatch' | null>(() => {
    if (this.confirmPassword().length === 0) return null;
    return this.passwordsMatch() ? 'match' : 'mismatch';
  });

  readonly canSubmit = computed(() => this.passwordsMatch() && this.termsAccepted());


  private readonly usernameKey = computed(() =>
    this.username().trim().length > 0 ? null : 'auth.signup.error.username.required',
  );

  private readonly emailKey = computed(() => {
    const value = this.email().trim();
    if (value.length === 0) return 'auth.signup.error.email.required';
    return EMAIL_PATTERN.test(value) ? null : 'auth.signup.error.email.invalid';
  });

  private readonly passwordKey = computed(() => {
  const p = this.password();
  if (p.length === 0) return 'auth.signup.error.password.required';
  if (p.length < 8) return 'auth.signup.error.password.length';
  if (!/(?=.*[A-Z])/.test(p)) return 'auth.signup.error.password.uppercase';
  if (!/(?=.*\d)/.test(p)) return 'auth.signup.error.password.number';
  return null;
});

  private readonly confirmKey = computed(() => {
    if (this.confirmPassword().length === 0) return 'auth.signup.error.confirm.required';
    return this.passwordsMatch() ? null : 'auth.signup.error.confirm.mismatch';
  });

  private readonly termsKey = computed(() =>
    this.termsAccepted() ? null : 'auth.signup.error.terms.required',
  );

  readonly formValid = computed(
    () =>
      !this.usernameKey() &&
      !this.emailKey() &&
      !this.passwordKey() &&
      !this.confirmKey() &&
      !this.termsKey(),
  );


  readonly usernameError = computed(() => this.visible('username', this.usernameKey()));
  readonly emailError = computed(() => this.visible('email', this.emailKey()));
  readonly passwordError = computed(() => this.visible('password', this.passwordKey()));
  readonly confirmError = computed(() => this.visible('confirmPassword', this.confirmKey()));
  readonly termsError = computed(() => this.visible('terms', this.termsKey()));

  touch(field: Field): void {
    this.touched.update((current) => (current.has(field) ? current : new Set(current).add(field)));
  }

  onUsernameInput(event: Event): void {
    this.username.set((event.target as HTMLInputElement).value);
  }

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onPasswordInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  onConfirmPasswordInput(event: Event): void {
    this.confirmPassword.set((event.target as HTMLInputElement).value);
  }

  onTermsChange(event: Event): void {
    this.termsAccepted.set((event.target as HTMLInputElement).checked);
    this.touch('terms');
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(event: Event): void {
  event.preventDefault();
  this.touched.set(new Set(ALL_FIELDS));

  if (!this.formValid()) return;

  this.isLoading.set(true);
  this.registerError.set(null);

  const payload: SignUpPayload = {
    username: this.username().trim(),
    email: this.email().trim(),
    password: this.password(),
  };

  this.signUp.emit(payload);

  this.userService.createUser(payload).subscribe({
    next: () => {
      this.isLoading.set(false);
      this.showSuccessModal.set(true);
      setTimeout(() => {
        this.showSuccessModal.set(false);
        this.router.navigate(['/login']); 
      }, 2000);
    },
    error: (err) => {
      this.isLoading.set(false);
      if (err.status === 409) {
        this.registerError.set('auth.signup.error.conflict'); 
      } else {
        this.registerError.set('auth.signup.error.general');
      }
    }
  });
  }

  private visible(field: Field, key: string | null): string | null {
    return this.touched().has(field) ? key : null;
  }
}