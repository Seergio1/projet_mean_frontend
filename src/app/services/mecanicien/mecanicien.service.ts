import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MecanicienService {
    private apiUrl = `${environment.apiUrl}/mecanicien`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) 
  { }

  getAllTacheMecanicien(idMecanicien): Observable<{ data: any[], message: string}> {
      const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
  
      return this.http.get<{
        data: any[], 
        message: string
      }>(`${this.apiUrl}/taches/${idMecanicien}`, 
        { headers } 
      );
  }

  updateTacheMecanicien(mecanicienId, idTache,newEtat, libelle): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');

    const body = {
      mecanicienId : mecanicienId,
      newEtat: newEtat,
      libelle: undefined
    }
    // console.log(body);
    

    return this.http.put<{
      data: any[], 
      message: string
    }>(`${this.apiUrl}/tache/modification_etat/${idTache}`,
      body,
      { headers }
    );
  }
}
