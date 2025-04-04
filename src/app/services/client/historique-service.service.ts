import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueServiceService {
  private apiUrl = `${environment.apiUrl}/client`;
  constructor(private http: HttpClient,private authService: AuthService) { }

  historiqueService(id_client:string): Observable<{ data: any[], message: string }> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ data: any[], message: string }>(
      `${this.apiUrl}/service/historique_tous_vehicule`, {id_client},
      { headers }
  );
  }
}
