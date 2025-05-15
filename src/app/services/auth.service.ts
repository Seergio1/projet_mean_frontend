import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

interface UserInfo {
  email: string;
  role: string;
  nom: string;
  id: string;
}

interface JwtPayload {
  exp: number; // Timestamp en secondes
  id: string;
  role: string;
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

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      return null;
    }
  }

   isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    return Date.now() > decoded.exp * 1000;
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, JSON.stringify(token));

    const decoded = this.decodeToken(token);
    if (decoded) {
      const expiration = decoded.exp * 1000 - Date.now(); // délai en ms
      console.log(expiration);
      
      setTimeout(() => {
        this.logout(); 
      }, expiration);
    }
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
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    return requiredRoles.some(role_ => userRoles.includes(role_));
  }

  // hasAnyRole(requiredRole: string[]): boolean {
  //   const user = this.getUserInfo();
  //   if (!user || !user.role) return false;
  //   return requiredRole.some(role => user.role.includes(role));
  // }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getAuthHeaders(): HttpHeaders {
      const token = this.getToken();
      // console.log(token);
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  modifierDate(date) {
    const date1 = new Date(date);
    const reponse = date1.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    console.log(reponse);

    return reponse;
  }
}
