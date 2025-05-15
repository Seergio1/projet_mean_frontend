import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MarqueService {
  private apiUrlM = `${environment.apiUrl}/manager`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  createModele(nom: string) {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('nom', nom);
    return this.http.post(`${this.apiUrlM}/modele/ajout`, params , { headers });
  }

  removeModele(id: string) {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.delete(`${this.apiUrlM}/modele/delete/${id}`, { headers });
  }

  updateModeleById(id: string, nom: string) {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('nom', nom);
    return this.http.put(`${this.apiUrlM}/modele/update/${id}`, params, { headers });
  }
}
