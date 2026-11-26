import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { getTranslocoTestingModule } from '@testutils/stubs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { currentUser, UserService } from '../../user/user-service';


describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let userServiceMock: { logout: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    currentUser.set(null);
    userServiceMock = { logout: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Navbar, getTranslocoTestingModule()],
      providers: [
        provideRouter([]),
        { provide: StringsService, useValue: { get: (key: string) => key } },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
    afterEach(() => {
    currentUser.set(null);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link Mapa to the /map route', () => {
    fixture.detectChanges();
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.navbar-links a'),
    );
    const mapLink = links.find(link => link.getAttribute('href') === '/map');
    expect(mapLink).toBeTruthy();
  });

  it('should link Inicio to the landing root route', () => {
    fixture.detectChanges();
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.navbar-links a'),
    );
    const homeLink = links.find(link => link.getAttribute('href') === '/');
    expect(homeLink).toBeTruthy();
  });

  it('shows sign in and sign up links when no user is logged in', () => {
    currentUser.set(null);
    fixture.detectChanges();

    const authContainer: HTMLElement = fixture.nativeElement.querySelector('.navbar-auth');
    expect(authContainer.textContent).toContain('navbar.sign.out');
    expect(authContainer.textContent).toContain('navbar.sign.in');
    expect(authContainer.textContent).not.toContain('navbar.logout');
  });

  it('shows user greeting and logout button when a user is logged in', () => {
    currentUser.set({ id: 1, username: 'EduardoQA', role: 'USER' });
    fixture.detectChanges();

    const authContainer: HTMLElement = fixture.nativeElement.querySelector('.navbar-auth');
    expect(authContainer.textContent).toContain('navbar.greeting');    expect(authContainer.textContent).toContain('navbar.logout');
    expect(authContainer.textContent).not.toContain('navbar.sign.in');
  });

  it('calls userService.logout when clicking the logout button', () => {
    currentUser.set({ id: 1, username: 'EduardoQA', role: 'USER' });
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.navbar-auth button'),
    ) as HTMLButtonElement[];
    const logoutButton = buttons[buttons.length - 1];
    expect(logoutButton).toBeTruthy();

    logoutButton.click();
    fixture.detectChanges();

    expect(userServiceMock.logout).toHaveBeenCalledTimes(1);
  });

});
