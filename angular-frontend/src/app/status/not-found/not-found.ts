import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-not-found',
  templateUrl: './not-found.html',
})
export class NotFound {
  private readonly router = inject(Router);
  private readonly previousUrl = this.router.currentNavigation()?.previousNavigation?.finalUrl;
  protected readonly canGoBack = this.previousUrl !== undefined;

  protected goBack(): void {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    }
  }
}
