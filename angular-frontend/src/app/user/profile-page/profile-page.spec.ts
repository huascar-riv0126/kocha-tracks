import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProfilePageComponent } from './profile-page';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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
      providers: [{ provide: Router, useValue: routerMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('1. Al ingresar a la página', () => {
    it('debe tener los campos de nombre de usuario y correo deshabilitados', () => {
      expect(component.profileForm.get('username')?.disabled).toBe(true);
      expect(component.profileForm.get('email')?.disabled).toBe(true);
      expect(component.isEditing()).toBe(false);
    });
  });

  describe('2. Al activar el slider de edición', () => {
    it('debe habilitar los campos de usuario y correo al llamar toggleEditing', () => {
      component.toggleEditing();
      expect(component.isEditing()).toBe(true);
      expect(component.profileForm.get('username')?.enabled).toBe(true);
      expect(component.profileForm.get('email')?.enabled).toBe(true);
    });

    it('debe revertir los cambios y deshabilitar si se presiona nuevamente el toggle', () => {
      component.toggleEditing(); // Activar edición
      component.profileForm.patchValue({ username: 'NuevoNombre123' });

      component.toggleEditing(); // Cancelar edición
      expect(component.isEditing()).toBe(false);
      expect(component.profileForm.get('username')?.value).toBe('Junpix7489');
      expect(component.profileForm.get('username')?.disabled).toBe(true);
    });

    it('debe actualizar los datos iniciales al guardar cambios válidos', () => {
      component.toggleEditing();
      component.profileForm.patchValue({
        username: 'JuanActualizado',
        email: 'juan.nuevo@example.com'
      });

      component.onSaveProfile();
      expect(component.isEditing()).toBe(false);
      expect(component.initialProfile.username).toBe('JuanActualizado');
    });
  });

  describe('3. Seguridad y Cambio de contraseña', () => {
    it('debe redirigir a /auth/cambiar-contrasena al hacer clic en cambiar contraseña', () => {
      component.navigateToChangePassword();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/cambiar-contrasena']);
    });
  });

  describe('4. Preferencias de Notificaciones', () => {
    it('el botón de guardar preferencias debe estar deshabilitado si no hay cambios', () => {
      expect(component.hasNotificationChanges()).toBe(false);
    });

    it('debe habilitar el botón de guardar preferencias al alterar un toggle', () => {
      component.notificationForm.patchValue({ newEvents: false });
      expect(component.hasNotificationChanges()).toBe(true);
    });

    it('debe actualizar preferencias y deshabilitar el botón tras guardar', () => {
      component.notificationForm.patchValue({ eventEndings: true });
      component.onSaveNotifications();

      expect(component.initialNotifications.eventEndings).toBe(true);
      expect(component.hasNotificationChanges()).toBe(false);
    });
  });
});