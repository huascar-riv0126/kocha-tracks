import { computed, Injectable, signal } from '@angular/core';

export interface AuthenticatedUser {
  id?: number;
  username: string;
  email?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AuthenticatedUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  signIn(user: AuthenticatedUser): void {
    this._currentUser.set({ ...user });
  }

  signOut(): void {
    this._currentUser.set(null);
  }
}
