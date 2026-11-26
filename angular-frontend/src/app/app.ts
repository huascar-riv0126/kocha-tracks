
import { Component, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'angular-frontend';

  private readonly router = inject(Router);

  readonly isInProgress = signal(
    this.isInProgressUrl(this.router.url)
  );

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        ),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.isInProgress.set(
          this.isInProgressUrl(event.urlAfterRedirects)
        );
      });
  }

  private isInProgressUrl(url: string): boolean {
    const pathname = url.split(/[?#]/)[0];

    return (
      pathname === '/en-construccion' ||
      pathname === '/en-construccion/'
    );
  }
}
