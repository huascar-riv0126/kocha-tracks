import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  const previousUrlTree = { toString: () => '/map' } as unknown as UrlTree;
  let navigatedTo: UrlTree[];

  beforeEach(async () => {
    navigatedTo = [];

    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function createComponent(options: { hasPreviousNavigation: boolean }) {
    const router = TestBed.inject(Router);

    Object.assign(router, {
      currentNavigation: () =>
        options.hasPreviousNavigation
          ? { previousNavigation: { finalUrl: previousUrlTree } }
          : { previousNavigation: null },
      navigateByUrl: (url: UrlTree) => {
        navigatedTo.push(url);
        return Promise.resolve(true);
      },
    });

    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();

    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('should create', () => {
    const { fixture } = createComponent({ hasPreviousNavigation: false });

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the 404 code', () => {
    const { element } = createComponent({ hasPreviousNavigation: false });

    expect(element.textContent).toContain('404');
  });

  it('should always render a link to the home page', () => {
    const { element } = createComponent({ hasPreviousNavigation: false });

    const homeLink = element.querySelector('a');

    expect(homeLink).not.toBeNull();
    expect(homeLink?.getAttribute('href')).toBe('/');
  });

  describe('when the user arrived directly (no previous navigation)', () => {
    it('should not render the go back button', () => {
      const { element } = createComponent({ hasPreviousNavigation: false });

      expect(element.querySelector('button')).toBeNull();
    });
  });

  describe('when the user came from another page of the app', () => {
    it('should render the go back button', () => {
      const { element } = createComponent({ hasPreviousNavigation: true });

      expect(element.querySelector('button')).not.toBeNull();
    });

    it('should navigate to the previous url when the button is clicked', () => {
      const { element } = createComponent({ hasPreviousNavigation: true });

      element.querySelector('button')!.click();

      expect(navigatedTo).toEqual([previousUrlTree]);
    });
  });
});
