
import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from '../auth-service';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TranslocoPipe,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);

  readonly email = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);

  readonly emailTouched = signal(false);
  readonly passwordTouched = signal(false);
  readonly submitted = signal(false);

  readonly loginRequested = output<LoginCredentials>();

  readonly emailValid = computed(() => {
    const value = this.email().trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  });

  readonly emailRequired = computed(() =>
    this.email().trim().length === 0
  );

  readonly emailInvalid = computed(() =>
    !this.emailRequired() && !this.emailValid()
  );

  readonly passwordRequired = computed(() =>
    this.password().length === 0
  );

  readonly canSubmit = computed(() =>
    this.emailValid() && !this.passwordRequired()
  );

  readonly showEmailError = computed(() =>
    (this.emailTouched() || this.submitted()) &&
    !this.emailValid()
  );

  readonly showPasswordError = computed(() =>
    (this.passwordTouched() || this.submitted()) &&
    this.passwordRequired()
  );

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  onEmailChange(value: string): void {
    this.email.set(value);
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
  }

  onEmailBlur(): void {
    this.emailTouched.set(true);
  }

  onPasswordBlur(): void {
    this.passwordTouched.set(true);
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (!this.canSubmit()) {
      return;
    }

    const email = this.email().trim();

    // The login endpoint is not wired yet; seed the shared session with the
    // submitted identity so the navbar can react to authentication immediately.
    this.authService.signIn({
      username: email.split('@')[0],
      email,
      role: 'USER',
    });

    this.loginRequested.emit({
      email,
      password: this.password(),
    });
  }
}
