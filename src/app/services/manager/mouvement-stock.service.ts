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
    private apiUrl = `${environment.apiUrl}/client`;
    private apiUrlM = `${environment.apiUrl}/manager`;
  

  constructor(private http: HttpClient, private authService: AuthService) { }

  
    private getApiUrl(role: string): string {
      switch (role) {
        case 'mecanicien':
          return this.apiUrl;
        case 'manager':
          return this.apiUrlM;
        default:
          throw new Error(`Rôle non supporté : ${role}`);
      }
    }

  getMouvementStock(): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    
    return this.http.get<{
      data: any[], 
      message: string
    }>(`${this.apiUrlM}/mouvement-stock`, { headers });
  }

    getMouvementStockByArticle(id_Article: string,role: string): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    const apiUrl = this.getApiUrl(role);
    return this.http.get<{
      data: any[], 
      message: string
    }>(`${apiUrl}/mouvement-stock-article/${id_Article}`, { headers });
  }

  getDetailsStock(nomArticle: string,role: string): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('nomArticle',nomArticle);
    const apiUrl = this.getApiUrl(role);
    return this.http.get<{
      data: any[], 
      message: string
    }>(`${apiUrl}/article`, 
      { headers, params } 
    );
  }

  insertMouvementStock(body: any): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    
    return this.http.put<{
      data: any[], 
      message: string
    }>(`${this.apiUrlM}/insert-mvmt`,
      body,
      { headers } 
    );
  }

  getTotalDepenseArticle(): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    
    return this.http.get<{
      data: any[], 
      message: string
    }>(`${this.apiUrlM}/article-depense`,
      { headers } 
    );
  }
}
