import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface UserProfileData {
  username: string;
  email: string;
}

export interface UserNotificationPreferences {
  newEvents: boolean;
  eventUpdates: boolean;
  eventEndings: boolean;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.scss']
})
export class ProfilePageComponent implements OnInit {
  isEditing = signal<boolean>(false);
  hasNotificationChanges = signal<boolean>(false);

  profileForm!: FormGroup;
  notificationForm!: FormGroup;

  initialProfile: UserProfileData = {
    username: 'Junpix7489',
    email: 'juan.pa.7801@example.com'
  };

  initialNotifications: UserNotificationPreferences = {
    newEvents: true,
    eventUpdates: true,
    eventEndings: false
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.buildForms();
  }

  private buildForms(): void {
    // 1. Campos deshabilitados por defecto
    this.profileForm = this.fb.group({
      username: [{ value: this.initialProfile.username, disabled: true }, [Validators.required]],
      email: [{ value: this.initialProfile.email, disabled: true }, [Validators.required, Validators.email]]
    });

    // 2. Notificaciones con sliders/toggles
    this.notificationForm = this.fb.group({
      newEvents: [this.initialNotifications.newEvents],
      eventUpdates: [this.initialNotifications.eventUpdates],
      eventEndings: [this.initialNotifications.eventEndings]
    });

    // 4. Detección de cambios en notificaciones para habilitar el botón
    this.notificationForm.valueChanges.subscribe((vals: UserNotificationPreferences) => {
      const changed =
        vals.newEvents !== this.initialNotifications.newEvents ||
        vals.eventUpdates !== this.initialNotifications.eventUpdates ||
        vals.eventEndings !== this.initialNotifications.eventEndings;
      this.hasNotificationChanges.set(changed);
    });
  }

  // 2. Comportamiento del slider de edición
  toggleEditing(): void {
    const nextState = !this.isEditing();
    this.isEditing.set(nextState);

    if (nextState) {
      this.profileForm.get('username')?.enable();
      this.profileForm.get('email')?.enable();
    } else {
      // 2.3 Si se aprieta de nuevo, se cancelan los cambios y se deshabilitan
      this.profileForm.reset(this.initialProfile);
      this.profileForm.get('username')?.disable();
      this.profileForm.get('email')?.disable();
    }
  }

  onSaveProfile(): void {
    if (this.profileForm.valid && this.isEditing()) {
      const updated = this.profileForm.getRawValue() as UserProfileData;
      // Aquí se conectará el servicio con PUT/PATCH
      this.initialProfile = { ...updated };
      this.toggleEditing();
    }
  }

  onSaveNotifications(): void {
    if (this.hasNotificationChanges()) {
      const updated = this.notificationForm.value as UserNotificationPreferences;
      // Aquí se conectará el servicio con PUT/PATCH de notificaciones
      this.initialNotifications = { ...updated };
      this.hasNotificationChanges.set(false);
    }
  }

  // 3. Redirección a cambio de contraseña
  navigateToChangePassword(): void {
    this.router.navigate(['/auth/cambiar-contrasena']);
  }
}