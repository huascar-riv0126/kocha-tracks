import { afterNextRender, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  imports: [RouterLink, TranslocoPipe],
  selector: 'app-not-found',
  templateUrl: './not-found.html',
})
export class NotFound {
  protected readonly canGoBack = signal(false);

  constructor() {
    afterNextRender(() => {
      this.canGoBack.set(window.navigation?.canGoBack ?? false);
    });
  }

  protected goBack(): void {
    if (window.navigation?.canGoBack) {
      window.navigation.back();
    }
  }
}
