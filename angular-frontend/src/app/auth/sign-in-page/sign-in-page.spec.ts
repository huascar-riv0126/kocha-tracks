import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { StringsServiceStub, getTranslocoTestingModule } from '@testutils/stubs';
import { routes } from '../../app.routes';
import { StringsService } from '../../core/strings/strings-service/strings-service';
import { Navbar } from '../../layout/navbar/navbar';
import { SignUp } from '../sign-up/sign-up';
import { SignInPage } from './sign-in-page';

/**
 * UH-26 - Sign-In page.
 * These tests check that the PAGE renders and is wired to the router.
 * The form behaviour itself is covered in login.spec.ts and is not repeated here.
 */
describe('UH-26 Sign-In page', () => {
  describe('Rendering', () => {
    let fixture: ComponentFixture<SignInPage>;
    let root: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SignInPage],
        providers: [provideRouter([])],
      }).compileComponents();

      fixture = TestBed.createComponent(SignInPage);
      root = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();
    });

    it('creates the page', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the page wrapper', () => {
      expect(root.querySelector('[data-testid="sign-in-page"]')).toBeTruthy();
    });

    it('renders exactly one login form inside the wrapper', () => {
      const wrapper = root.querySelector('[data-testid="sign-in-page"]')!;

      expect(wrapper.querySelectorAll('app-login').length).toBe(1);
    });

    it('renders the parts of the form: title, email, password and submit button', () => {
      expect(root.querySelector('h1')?.textContent?.trim()).toBe('Inicio de sesión');
      expect(root.querySelector('#email')).toBeTruthy();
      expect(root.querySelector('#password')).toBeTruthy();
      expect(root.querySelector('button[type="submit"]')).toBeTruthy();
    });

    it('renders the link to create an account', () => {
      expect(root.querySelector('a[href="/register"]')).toBeTruthy();
    });
  });

  describe('Styling: Tailwind 4 classes and color variables', () => {
    let root: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SignInPage],
        providers: [provideRouter([])],
      }).compileComponents();

      const fixture = TestBed.createComponent(SignInPage);
      root = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();
    });

    it('uses the section-alt background and centers the content on the full screen', () => {
      const wrapper = root.querySelector('[data-testid="sign-in-page"]')!;

      expect(wrapper.classList.contains('bg-section-alt')).toBe(true);
      expect(wrapper.classList.contains('min-h-screen')).toBe(true);
      expect(wrapper.classList.contains('flex')).toBe(true);
      expect(wrapper.classList.contains('items-center')).toBe(true);
      expect(wrapper.classList.contains('justify-center')).toBe(true);
    });

    it('draws the form card with the surface and border color variables', () => {
      const card = root.querySelector('app-login > div')!;

      expect(card.classList.contains('bg-surface')).toBe(true);
      expect(card.classList.contains('border-border-default')).toBe(true);
    });

    it('does not nest a second full-screen section inside the page', () => {
      const wrapper = root.querySelector('[data-testid="sign-in-page"]')!;

      expect(wrapper.querySelectorAll('.min-h-screen').length).toBe(0);
    });

    it('does not use inline styles', () => {
      expect(root.querySelectorAll('[style]').length).toBe(0);
    });
  });

  describe('Routing: /login and /register', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        providers: [
          provideRouter(routes),
          { provide: StringsService, useClass: StringsServiceStub },
        ],
      }).compileComponents();
    });

    it('renders the sign-in page when the user goes to /login', async () => {
      const harness = await RouterTestingHarness.create();

      const page = await harness.navigateByUrl('/login', SignInPage);

      expect(page).toBeInstanceOf(SignInPage);
      expect(
        harness.routeNativeElement?.querySelector('[data-testid="sign-in-page"]'),
      ).toBeTruthy();
    });

    it('keeps /register pointing to the sign-up page', async () => {
      const harness = await RouterTestingHarness.create();

      const page = await harness.navigateByUrl('/register', SignUp);

      expect(page).toBeInstanceOf(SignUp);
    });
  });

  describe('Links that lead to the login page', () => {
    it('the "log in" link of the sign-up page leads to the sign-in page', async () => {
      await TestBed.configureTestingModule({
        providers: [
          provideRouter(routes),
          { provide: StringsService, useClass: StringsServiceStub },
        ],
      }).compileComponents();

      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/register', SignUp);

      const link = harness.routeNativeElement!.querySelector<HTMLAnchorElement>(
        '[data-testid="signup-login-link"]',
      )!;
      const href = link.getAttribute('href')!;

      expect(href).toBe('/login');
      const page = await harness.navigateByUrl(href, SignInPage);
      expect(page).toBeInstanceOf(SignInPage);
    });

    it('the login button of the navbar points to /login', async () => {
      await TestBed.configureTestingModule({
        imports: [Navbar, getTranslocoTestingModule()],
        providers: [
          provideRouter([]),
          { provide: StringsService, useValue: { get: (key: string) => key } },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(Navbar);
      await fixture.whenStable();
      fixture.detectChanges();

      const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
        '.btn-login',
      );

      expect(button?.getAttribute('href')).toBe('/login');
    });
  });
});