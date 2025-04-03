import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  private apiUrl = `${environment.apiUrl}/client`;

  constructor(private http: HttpClient,private authService: AuthService) { }

  getVehicules(id_client: string): Observable<{data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.get<{data: any[], message: string}>(`${this.apiUrl}/vehicules/${id_client}`, { headers });
  }

  getServices(): Observable<{data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.get<{data: any[], message: string}>(`${this.apiUrl}/services`, { headers });
  }

  getDisabledDates(): Observable<{data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.get<{data: any[], message: string}>(`${this.apiUrl}/rendez-vous/indisponible`, { headers });
  }

  createRendezvous(body: any): Observable<{ data: any[], message: string }> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');

    return this.http.post<{ data: any[], message: string }>(
        `${this.apiUrl}/rendez-vous/validation`,
        body,
        { headers }
    );
  }

  getRendezVousClient(idClient: any): Observable<{ data: any[], message: string }> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.get<{ data: any[], message: string }>(`${this.apiUrl}/rendez-vous/tous/${idClient}`,{headers});
  }

  annulerRendezVous(rendezVousId: string, type: string): Observable<string> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.request<string>('DELETE', `${this.apiUrl}/rendez-vous/annulation/${rendezVousId}`, {
      headers,
      body: { type }
    });
  }


}
