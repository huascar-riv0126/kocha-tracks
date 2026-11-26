
import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-in-progress',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoPipe,
  ],
  templateUrl: './in-progress.html',
})
export class InProgress {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  goBack(): void {
    const state = this.location.getState() as {
      navigationId?: number;
    } | null;

    if (
      state &&
      typeof state.navigationId === 'number' &&
      state.navigationId > 1
    ) {
      this.location.back();
      return;
    }

    void this.router.navigateByUrl('/');
  }
}
