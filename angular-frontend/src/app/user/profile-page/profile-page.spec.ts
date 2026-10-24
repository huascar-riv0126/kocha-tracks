import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProfilePageComponent } from './profile-page';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { STRINGS_LOADER } from '../../core/strings/strings-token';

describe('ProfilePageComponent (UH-39)', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        StringsService,
        {
          provide: STRINGS_LOADER,
          useValue: {
            load: () => Promise.resolve({
              'brand': 'Kocha Tracks',
              'profile.info.title': 'Información del perfil',
              'profile.editing.title': 'Editando',
              'profile.editing.desc': 'Presiona nuevamente para cancelar y deshabilitar la edicion.',
              'profile.avatar.label': 'Imagen de Perfil',
              'profile.username.label': 'Nombre de Usuario',
              'profile.email.label': 'Dirección de correo electrónico',
              'profile.btn.save_changes': 'Guardar cambios',
              'profile.security.title': 'Seguridad',
              'profile.security.change_password': 'Cambiar contraseña',
              'profile.notifications.title': 'Notificaciones',
              'profile.notifications.new_events.title': 'Nuevos eventos',
              'profile.notifications.new_events.desc': 'Alertas de incidentes recién reportados en tus zonas de interés.',
              'profile.notifications.updates.title': 'Actualizaciones de eventos',
              'profile.notifications.updates.desc': 'Cambios en severidad, cierres parciales o nuevos desvíos.',
              'profile.notifications.endings.title': 'Finalizaciones',
              'profile.notifications.endings.desc': 'Reportes de paso totalmente libre tras un evento cerrado.',
              'profile.notifications.btn.save': 'Guardar Preferencias'
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Criterio 1: Estado inicial al ingresar a la página', () => {
    it('los campos de usuario y correo deben estar deshabilitados', () => {
      expect(component.profileForm.get('username')?.disabled).toBe(true);
      expect(component.profileForm.get('email')?.disabled).toBe(true);
      expect(component.isEditing()).toBe(false);
    });
  });

  describe('Criterio 2: Activación y reversión con el slider de edición', () => {
    it('debe habilitar los campos al activar el slider', () => {
      component.toggleEditing();
      expect(component.isEditing()).toBe(true);
      expect(component.profileForm.get('username')?.enabled).toBe(true);
      expect(component.profileForm.get('email')?.enabled).toBe(true);
    });

    it('debe revertir cambios y deshabilitar campos al desactivar el slider', () => {
      component.toggleEditing();
      component.profileForm.patchValue({ username: 'NuevoUsuarioPrueba' });

      component.toggleEditing();
      expect(component.isEditing()).toBe(false);
      expect(component.profileForm.get('username')?.value).toBe('Junpix7489');
      expect(component.profileForm.get('username')?.disabled).toBe(true);
    });

    it('debe guardar los cambios modificados al ejecutar onSaveProfile', () => {
      component.toggleEditing();
      component.profileForm.patchValue({
        username: 'UsuarioGuardado',
        email: 'nuevo.correo@example.com'
      });

      component.onSaveProfile();
      expect(component.isEditing()).toBe(false);
      expect(component.initialProfile.username).toBe('UsuarioGuardado');
    });
  });

  describe('Criterio 3: Botón Cambiar Contraseña', () => {
    it('debe redirigir al usuario al módulo de cambio de contraseña', () => {
      component.navigateToChangePassword();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/cambiar-contrasena']);
    });
  });

  describe('Criterio 4: Feature toggles de Notificaciones', () => {
    it('el botón de guardar preferencias debe estar deshabilitado si no hay cambios', () => {
      expect(component.hasNotificationChanges()).toBe(false);
    });

    it('debe detectar cambios y habilitar el botón al alterar cualquier toggle', () => {
      component.notificationForm.patchValue({ newEvents: false });
      expect(component.hasNotificationChanges()).toBe(true);
    });

    it('debe persistir preferencias y deshabilitar el botón al guardar', () => {
      component.notificationForm.patchValue({ eventEndings: true });
      component.onSaveNotifications();

      expect(component.initialNotifications.eventEndings).toBe(true);
      expect(component.hasNotificationChanges()).toBe(false);
    });
  });
});