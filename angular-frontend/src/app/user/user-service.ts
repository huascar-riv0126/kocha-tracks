import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const USERS_API_URL = 'https://kocha-tracks.onrender.com/api/v1/users';

export interface CreateUserRequest {
  username: string;
  email?: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  readonly apiUrl = USERS_API_URL;

  createUser(userData: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, userData);
  }
}