import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/client`;

  constructor(private http: HttpClient,private authService: AuthService) {}


  // Récupérer les notifications par ID du client
  getNotificationsByIdClient(id_client: string): Observable<any> {
    const headers = this.authService.getAuthHeaders(); // Ajouter l'en-tête d'autorisation
    return this.http.get(`${this.apiUrl}/notifications/${id_client}`, { headers });
  }

  // Mettre à jour l'état d'une notification
  updateEtatNotification(id_notification: string, etat: boolean): Observable<any> {
    const headers =  this.authService.getAuthHeaders(); // Ajouter l'en-tête d'autorisation
    return this.http.put(`${this.apiUrl}/notification/etat/${id_notification}`, { etat }, { headers });
  }

  marquerTousLu(clientId: string): Observable<any> {
    const headers =  this.authService.getAuthHeaders(); // Ajouter l'en-tête d'autorisation
    return this.http.put(`${this.apiUrl}/notifications/etat/${clientId}`, {}, { headers });
  }
}
