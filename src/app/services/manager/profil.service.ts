import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private apiUrl = `${environment.apiUrl}/manager`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  updateRole(idUtilisateur, newRole): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('id',idUtilisateur);
    const body = { role: newRole };
    return this.http.put<{
      data: any[], 
      message: string
    }>(`${this.apiUrl}/update-role/${idUtilisateur}`, 
      body,
      { headers } 
    );
  }

  findUtilisateurs(): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');

    return this.http.get<{
      data: any[], 
      message: string
    }>(`${this.apiUrl}/profil`, 
      { headers } 
    );
  }
}
