
import { Component, computed, output, signal } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { BrandComponent } from '../../shared/brand/brand';

export interface RecoverPasswordPayload {
  newPassword: string;
}

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [GetStringsPipe, BrandComponent],
  templateUrl: './recover-password.html',
})
export class RecoverPassword {
  readonly recoveryRequested = output<RecoverPasswordPayload>();

  readonly newPassword = signal('');
  readonly confirmPassword = signal('');

  readonly showNewPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly passwordsMatch = computed(() =>
    this.newPassword().length > 0 &&
    this.confirmPassword().length > 0 &&
    this.newPassword() === this.confirmPassword()
  );

  readonly passwordsMismatch = computed(() =>
    this.confirmPassword().length > 0 &&
    this.newPassword() !== this.confirmPassword()
  );

  readonly canSubmit = computed(() =>
    this.newPassword().length > 0 &&
    this.confirmPassword().length > 0 &&
    this.passwordsMatch()
  );

  onNewPasswordInput(event: Event): void {
    this.newPassword.set(
      (event.target as HTMLInputElement).value
    );
  }

  onConfirmPasswordInput(event: Event): void {
    this.confirmPassword.set(
      (event.target as HTMLInputElement).value
    );
  }

  toggleNewPassword(): void {
    this.showNewPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.canSubmit()) {
      return;
    }

    this.recoveryRequested.emit({
      newPassword: this.newPassword(),
    });
  }
}
