
import { Component, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Estado del formulario
  readonly email = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);

  // Control de validaciones visuales
  readonly emailTouched = signal(false);
  readonly passwordTouched = signal(false);
  readonly submitted = signal(false);

  // Evento para integrar el login con autenticación
  readonly loginRequested = output<LoginCredentials>();

  // Comprobar formato del correo electrónico
  readonly emailValid = computed(() => {
    const value = this.email().trim();

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  });

  // El correo debe tener contenido
  readonly emailRequired = computed(() => {
    return this.email().trim().length === 0;
  });

  // El correo tiene formato incorrecto
  readonly emailInvalid = computed(() => {
    return !this.emailRequired() && !this.emailValid();
  });

  // La contraseña no puede estar vacía
  readonly passwordRequired = computed(() => {
    return this.password().length === 0;
  });

  // Validar todo el formulario
  readonly canSubmit = computed(() => {
    return this.emailValid() && !this.passwordRequired();
  });

  // Mostrar errores únicamente después de interactuar
  readonly showEmailError = computed(() => {
    return (
      (this.emailTouched() || this.submitted()) &&
      !this.emailValid()
    );
  });

  readonly showPasswordError = computed(() => {
    return (
      (this.passwordTouched() || this.submitted()) &&
      this.passwordRequired()
    );
  });

  // Mostrar u ocultar contraseña
  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  // Actualizar correo
  onEmailChange(value: string): void {
    this.email.set(value);
  }

  // Actualizar contraseña
  onPasswordChange(value: string): void {
    this.password.set(value);
  }

  // Marcar correo como visitado
  onEmailBlur(): void {
    this.emailTouched.set(true);
  }

  // Marcar contraseña como visitada
  onPasswordBlur(): void {
    this.passwordTouched.set(true);
  }

  // Enviar el formulario
  onSubmit(): void {
    this.submitted.set(true);

    if (!this.canSubmit()) {
      return;
    }

    // No registrar contraseñas en la consola.
    // La integración real se hará desde el componente padre
    // o desde el servicio de autenticación.
    this.loginRequested.emit({
      email: this.email().trim(),
      password: this.password(),
    });
  }
}
