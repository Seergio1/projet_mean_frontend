import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = `${environment.apiUrl}/client`;
  constructor(private http: HttpClient,private authService: AuthService) { }

  getEtatTache(rendezVousId: string): Observable<any> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(`${this.apiUrl}/taches/tous/${rendezVousId}`,{headers});
  }
}
