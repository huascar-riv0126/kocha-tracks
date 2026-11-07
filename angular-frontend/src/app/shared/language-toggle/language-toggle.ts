import { Component, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-toggle',
  templateUrl: './language-toggle.html',
})
export class LanguageToggle {
  private readonly translocoService = inject(TranslocoService, {
    optional: true,
  });

  readonly currentLang = signal(
    this.translocoService?.getActiveLang() || 'es',
  );

  toggleLang(): void {
    const nextLang = this.currentLang() === 'es' ? 'en' : 'es';

    if (!this.translocoService) {
      return;
    }

    this.translocoService.setActiveLang(nextLang);
    this.currentLang.set(nextLang);
  }
}
