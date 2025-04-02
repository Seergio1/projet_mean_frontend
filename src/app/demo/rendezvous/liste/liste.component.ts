import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-liste',
  imports: [CommonModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
  standalone: true
})
export default class ListeComponent implements OnInit{
  
  constructor(
    private rendezVousService: RendezvousService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}
  
  userInfo = null;
  allRenderVous: any[] = []
  message = ""
  rdv: any[] = [];
  modalRef!: NgbModalRef;

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo()
    this.getClientRendezVous();
  }

  getClientRendezVous(){
    if (!this.userInfo || !this.userInfo.id) {
      console.error("Utilisateur non authentifié ou ID manquant");
      return;
    }
    this.rendezVousService.getRendezVousClient(this.userInfo.id).subscribe({
      next: (response) =>{
        console.log(response);
        this.message = response.message
        this.allRenderVous = response.data
      },error: (err) => console.error('Erreur lors de la récupération des rendez-vous:',err)
    });
  }
  formatDate(date: string): string {
    const dateObject = new Date(date);
    const jour = dateObject.getDate();
    const mois = dateObject.getMonth() + 1;
    const annee = dateObject.getFullYear();
    const heure = dateObject.getHours();
    const minute = dateObject.getMinutes().toString().padStart(2, '0');
  
    const moisString = this.getMois(mois);
  
    return `${jour} ${moisString} ${annee} à ${heure}:${minute}`;
  }

 
  ouvrirModal(modal: any, rendezVous: any[]) {
    if (!rendezVous) {
      console.error("Aucun rendez-vous sélectionné");
      return;
    }

    this.rdv = Array.isArray(rendezVous) ? rendezVous : [rendezVous];

    // Ouvre la modale et stocke l'instance
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      windowClass: 'custom-modal-size'
    });
  }

  fermerModal() {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }

  getSommeService(services: any[], type: string): number {
    return services.reduce((somme, service) => somme + (type === "prix" ? service.prix : service.duree), 0);
  }
  

  formatPrix(prix: number): string {
    return prix != null ? prix.toLocaleString('fr-FR') : '0';
  }

  
  getMois(mois: number): string {
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return moisNoms[mois - 1] || '';
  }
  

}
