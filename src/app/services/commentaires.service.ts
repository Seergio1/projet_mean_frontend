import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cm } from '@fullcalendar/core/internal-common';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

interface Commentaire {
  id_utilisateur: string,
  libelle: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentairesService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllCommentairesClient(id_client: string): Observable<any> {
    const response = this.http.get(`${this.apiUrl}/client/commentaires/${id_client}`);
    return response;
  }

  getAllCommentaires(): Observable<any> {
    const response = this.http.get(`${this.apiUrl}/manager/commentaires`);
    return response;
  }

  insertCommentaires(commentaire: Commentaire): Observable<{ data: any[], message: string }> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');

    return this.http.put<{data: any[], message: string }>(`${this.apiUrl}/client/commentaire`, 
      commentaire,
      { headers }
    );
    // console.log(comt);
  }

}
