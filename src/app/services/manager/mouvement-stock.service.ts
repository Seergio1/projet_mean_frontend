import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

interface MouvementStock {
  id_utilisateur: string,
  libelle: string;
  date: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class MouvementStockService {
    private apiUrl = `${environment.apiUrl}/manager`;
  

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMouvementStock(): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.get<{
      data: any[], 
      message: string
    }>(`${this.apiUrl}/mouvement-stock`, { headers });
  }

  getDetailsStock(nomArticle: string): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('nomArticle',nomArticle);
    return this.http.get<{
      data: any[], 
      message: string
    }>(`${this.apiUrl}/article`, 
      { headers, params } 
    );
  }
}
