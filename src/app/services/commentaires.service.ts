import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Commentaire {
  libelle: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentairesService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllCommentaires(): Observable<any> {
    const response = this.http.get(`${this.apiUrl}/client/commentaires`);
    return response;
  }

  insertCommentaires(commentaire: Commentaire): void {
    const comt = this.http.put(`${this.apiUrl}/client/commentaire`, commentaire);
    console.log(comt);
  }

}
