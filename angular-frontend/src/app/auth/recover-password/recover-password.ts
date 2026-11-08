
import { Component, computed, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { BrandComponent } from '../../shared/brand/brand';

export interface RecoverPasswordPayload {
  email: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    RouterLink,
    GetStringsPipe,
    BrandComponent,
  ],
  templateUrl: './recover-password.html',
})
export class RecoverPassword {
  readonly recoveryRequested = output<RecoverPasswordPayload>();

  readonly email = signal('');
  readonly touched = signal(false);

  readonly isSubmitting = signal(false);

  readonly emailValid = computed(() =>
    EMAIL_PATTERN.test(this.email().trim())
  );

  readonly canSubmit = computed(() =>
    this.emailValid() && !this.isSubmitting()
  );

  readonly emailError = computed<string | null>(() => {
    if (!this.touched()) {
      return null;
    }

    if (this.email().trim().length === 0) {
      return 'auth.recovery.error.required';
    }

    if (!this.emailValid()) {
      return 'auth.recovery.error.invalid';
    }

    return null;
  });

  onEmailInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  onEmailBlur(): void {
    this.touched.set(true);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.touched.set(true);

    if (!this.canSubmit()) {
      return;
    }

    this.recoveryRequested.emit({
      email: this.email().trim(),
    });
  }
}
