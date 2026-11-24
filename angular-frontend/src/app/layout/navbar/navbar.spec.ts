import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../auth/auth-service';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { StringsServiceStub, getTranslocoTestingModule } from '../../testing/stubs';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: AuthService;

  async function setup(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [Navbar, getTranslocoTestingModule()],
      providers: [provideRouter([]), { provide: StringsService, useClass: StringsServiceStub }],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function testId(id: string): HTMLElement | null {
    return element().querySelector(`[data-testid="${id}"]`);
  }

  async function signIn(): Promise<void> {
    authService.signIn({
      username: 'Junpix7489',
      email: 'juan.perez@example.com',
      role: 'USER',
    });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await setup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link Mapa to the /map route', () => {
    const links: HTMLAnchorElement[] = Array.from(element().querySelectorAll('.navbar-links a'));
    const mapLink = links.find((link) => link.getAttribute('href') === '/map');
    expect(mapLink).toBeTruthy();
  });

  it('should link Inicio to the landing root route', () => {
    const links: HTMLAnchorElement[] = Array.from(element().querySelectorAll('.navbar-links a'));
    const homeLink = links.find((link) => link.getAttribute('href') === '/');
    expect(homeLink).toBeTruthy();
  });

  it('should show public navigation and sign-in links to a visitor', () => {
    expect(component.isAuthenticated()).toBe(false);
    expect(element().querySelectorAll('.navbar-links a').length).toBe(5);
    expect((testId('navbar-register') as HTMLAnchorElement).getAttribute('href')).toBe('/register');
    expect((testId('navbar-login') as HTMLAnchorElement).getAttribute('href')).toBe('/login');
    expect(testId('navbar-notifications')).toBeNull();
    expect(testId('navbar-notifications-indicator')).toBeNull();
    expect(testId('navbar-user-menu')).toBeNull();
  });

  it('should show notifications and the user menu to an authenticated user', async () => {
    await signIn();

    expect(component.isAuthenticated()).toBe(true);
    expect((testId('navbar-notifications') as HTMLAnchorElement).getAttribute('href')).toBe(
      '/notificaciones',
    );
    expect(testId('navbar-notifications-indicator')).toBeTruthy();
    expect(testId('navbar-user-name')?.textContent?.trim()).toBe('Junpix7489');
    expect(testId('navbar-user-avatar')?.textContent?.trim()).toBe('JU');
    expect(testId('navbar-login')).toBeNull();
    expect(testId('navbar-register')).toBeNull();
    expect(element().querySelectorAll('.navbar-links a').length).toBe(5);
  });

  it('should toggle the user dropdown with profile and logout actions', async () => {
    await signIn();

    expect(testId('navbar-user-dropdown')).toBeNull();

    (testId('navbar-user-menu') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.isUserMenuOpen()).toBe(true);
    expect(testId('navbar-user-dropdown')).toBeTruthy();
    expect((testId('navbar-profile-link') as HTMLAnchorElement).getAttribute('href')).toBe(
      '/perfil',
    );
    expect(testId('navbar-logout')).toBeTruthy();

    (testId('navbar-user-menu') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.isUserMenuOpen()).toBe(false);
    expect(testId('navbar-user-dropdown')).toBeNull();
  });

  it('should clear the session and navigate home on logout', async () => {
    const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    await signIn();
    (testId('navbar-user-menu') as HTMLButtonElement).click();
    fixture.detectChanges();
    (testId('navbar-logout') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.currentUser()).toBeNull();
    expect(component.isUserMenuOpen()).toBe(false);
    expect(testId('navbar-login')).toBeTruthy();
    expect(testId('navbar-notifications')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
