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

  getIdLastFacture(): Observable<any> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.apiUrl}/getIdLastFacture`, { headers });
  }

  getFactureByTache(idTache): Observable<any> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.apiUrl}/facture/tache/${idTache}`, { headers });
  }

  addFacture(vehiculeId,tacheId,clientId,serviceEtArticles): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');

    const body = {
      vehiculeId : vehiculeId,
      tacheId: tacheId,
      clientId: clientId,
      serviceEtArticles: serviceEtArticles
    }

    return this.http.post<{
      data: any[], 
      message: string
    }>(`${this.apiUrl}/facture/demande`, body, { headers });
  }

  miseAjourFacture(idFacture,serviceEtArticles): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');

    return this.http.put<{
      data: any[], 
      message: string
    }>(`${this.apiUrl}/facture/mise_a_jour/${idFacture}`,{ serviceEtArticles }, { headers });
  }

  miseAjourFactureEtat(idTache,newEtat): Observable<{ data: any, message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');  

    return this.http.put<{
      data: any, 
      message: string 
    }>(`${this.apiUrl}/facture/modification_etat_facture/${idTache}`,{ newEtat }, { headers });
    }

  genererPdf(idFacture): Observable<any> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');
  
    return this.http.get(`${this.apiUrl}/facture/pdf/${idFacture}`, {
      headers,
      responseType: 'blob'
    });
  }

  getAllFacturesByClient(idClient): Observable<{ data: any[], message: string}> {
    const headers = this.authService.getAuthHeaders().set('Content-Type', 'application/json');

    return this.http.get<{
      data: any[], 
      message: string
    }>(`${this.apiUrl}/factures/${idClient}`, { headers });
  }

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
