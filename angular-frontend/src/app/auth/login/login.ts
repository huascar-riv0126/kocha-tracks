import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserService, currentUser } from '../../user/user-service';

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
  
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);

  readonly emailTouched = signal(false);
  readonly passwordTouched = signal(false);
  readonly submitted = signal(false);

  readonly isLoading = signal(false);
  readonly loginError = signal<string | null>(null);
  readonly showSuccessModal = signal(false);

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
    this.emailValid() && !this.passwordRequired() && !this.isLoading()
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
    this.loginError.set(null); 
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    this.loginError.set(null);
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

    const payload = {
      email: this.email().trim(),
      password: this.password(),
    };
    
    this.loginRequested.emit(payload);

    this.isLoading.set(true);
    this.loginError.set(null);

    this.userService.loginUser(payload).subscribe({
      next: (response) => {
        currentUser.set(response); 
        this.isLoading.set(false);
        this.showSuccessModal.set(true);
        
        setTimeout(() => {
          this.showSuccessModal.set(false);
          this.router.navigate(['/']);
        }, 1500); 
      },
      error: () => {
        this.isLoading.set(false);
        this.loginError.set('auth.login.error.credentials'); 
      }
    });
  }
}