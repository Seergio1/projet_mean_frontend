import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface UserInfo {
  email: string;
  role: string;
  nom: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'token';
  private userKey = 'userInfo';

  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(user: { email: string; password: string; nom: string; contact: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token ? token.replace(/['"]+/g, '') : null; // Supprime les guillemets
  }

  saveUserInfo(user_info: UserInfo): void {
    localStorage.setItem(this.userKey, JSON.stringify(user_info));
  }

  getUserInfo(): UserInfo | null {
    return JSON.parse(localStorage.getItem(this.userKey) || 'null');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    const user = this.getUserInfo();
    if (!user || !user.role) return false;
    return requiredRoles.some(role_ => user.role.includes(role_));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
