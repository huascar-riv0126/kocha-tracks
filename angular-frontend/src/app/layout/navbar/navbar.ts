import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

import { AuthService } from '../../auth/auth-service';
import { GetStringsPipe } from '../../core/strings/get-strings-pipe';
import { BrandComponent } from '../../shared/brand/brand';
import { LanguageToggle } from '../../shared/language-toggle/language-toggle';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    BrandComponent,
    LanguageToggle,
    TranslocoPipe,
    GetStringsPipe,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isUserMenuOpen = signal(false);

  readonly userInitials = computed(() => {
    const username = this.currentUser()?.username ?? '';
    return username.trim().slice(0, 2).toUpperCase();
  });

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  logout(): void {
    this.authService.signOut();
    this.closeUserMenu();
    void this.router.navigate(['/']);
  }
}
