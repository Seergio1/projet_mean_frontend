import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`; 
  private tokenKey = ''; 

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer les informations de login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Méthode pour envoyer les informations d'enregistrement
  register(user: { email: string; password: string; nom: string; contact: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Méthode pour sauvegarder le token JWT dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Méthode pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken(); // Retourne true si un token est présent
  }

  // Méthode pour supprimer le token de localStorage (logout)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
