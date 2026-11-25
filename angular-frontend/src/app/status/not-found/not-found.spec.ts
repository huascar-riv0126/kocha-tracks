import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { NotFound } from './not-found';
import { provideRouter } from '@angular/router';

describe('NotFound', () => {
  let canGoBack: boolean;
  let back: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    canGoBack = false;
    back = vi.fn();

    Object.defineProperty(window, 'navigation', {
      configurable: true,
      value: {
        get canGoBack() {
          return canGoBack;
        },
        back,
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        NotFound,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              notfound: {
                status: '404',
                title: 'Page not found',
                description: 'The page you are looking for does not exist.',
                goback: 'Go back',
                gohome: 'Go home',
              },
            },
          },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
          preloadLangs: true,
        }),
      ],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();

    return {
      fixture,
      element: fixture.nativeElement as HTMLElement,
    };
  }

  it('should create', () => {
    const { fixture } = createComponent();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the 404 code', () => {
    const { element } = createComponent();

    expect(element.textContent).toContain('404');
  });

  it('should always render a link to the home page', () => {
    const { element } = createComponent();

    const homeLink = element.querySelector('a');

    expect(homeLink).not.toBeNull();
    expect(homeLink?.getAttribute('href')).toBe('/');
  });

  describe('when the browser cannot go back', () => {
    it('should not render the go back button', async () => {
      canGoBack = false;

      const { fixture, element } = createComponent();

      await fixture.whenStable();

      expect(element.querySelector('button')).toBeNull();
    });
  });

  describe('when the browser can go back', () => {
    it('should render the go back button', async () => {
      canGoBack = true;

      const { fixture, element } = createComponent();

      await fixture.whenStable();

      expect(element.querySelector('button')).not.toBeNull();
    });

    it('should navigate back when the button is clicked', async () => {
      canGoBack = true;

      const { fixture, element } = createComponent();

      await fixture.whenStable();

      element.querySelector('button')!.click();

      expect(back).toHaveBeenCalledTimes(1);
    });

    it('should not navigate back if the browser can no longer go back', async () => {
      canGoBack = true;

      const { fixture, element } = createComponent();

      await fixture.whenStable();

      canGoBack = false;

      element.querySelector('button')!.click();

      expect(back).not.toHaveBeenCalled();
    });
  });
});
