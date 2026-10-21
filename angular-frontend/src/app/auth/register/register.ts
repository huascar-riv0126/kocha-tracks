import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  username = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  acceptedTerms = signal(false);
  showPassword = signal(false);

  passwordsMatch = computed(() =>
    this.password().length > 0 &&
    this.password() === this.confirmPassword()
  );

  formValid = computed(() =>
    this.username().trim().length > 0 &&
    this.email().trim().length > 0 &&
    this.password().length >= 6 &&
    this.passwordsMatch() &&
    this.acceptedTerms()
  );

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
    if (!this.formValid()) {
      return;
    }

    console.log({
      username: this.username(),
      email: this.email(),
      password: this.password(),
    });
  }
}