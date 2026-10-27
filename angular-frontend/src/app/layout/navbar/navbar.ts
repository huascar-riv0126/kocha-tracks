import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BrandComponent } from '../../shared/brand/brand';

@Component({
  imports: [RouterLink, RouterLinkActive, TranslocoPipe, BrandComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly translocoService = inject(TranslocoService, { optional: true });
  readonly currentLang = signal<string>(this.translocoService?.getActiveLang() || 'es');

  changeLang(lang: string): void {
    if (this.translocoService) {
      this.translocoService.setActiveLang(lang);
      this.currentLang.set(lang);
    }
  }
}