
import { Component, computed, output, signal } from '@angular/core';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { BrandComponent } from '../../shared/brand/brand';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-change-password',
  imports: [GetStringsPipe, BrandComponent],
  templateUrl: './change-password.html',
})
export class ChangePassword {
  readonly passwordChangeRequested = output<ChangePasswordPayload>();

  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');

  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly passwordsMatch = computed(
    () =>
      this.confirmPassword().length > 0 &&
      this.newPassword() === this.confirmPassword()
  );

  readonly passwordsMismatch = computed(
    () =>
      this.confirmPassword().length > 0 &&
      this.newPassword() !== this.confirmPassword()
  );

  readonly canSubmit = computed(
    () =>
      this.currentPassword().length > 0 &&
      this.newPassword().length > 0 &&
      this.confirmPassword().length > 0 &&
      this.passwordsMatch() &&
      this.currentPassword() !== this.newPassword()
  );

  onCurrentPasswordInput(event: Event): void {
    this.currentPassword.set(
      (event.target as HTMLInputElement).value
    );
  }

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

  toggleCurrentPassword(): void {
    this.showCurrentPassword.update(value => !value);
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

    this.passwordChangeRequested.emit({
      currentPassword: this.currentPassword(),
      newPassword: this.newPassword(),
    });
  }
}
