import { CommonModule } from '@angular/common';
import { Component,ElementRef,OnInit, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';
import { MecanicienService } from 'src/app/services/mecanicien/mecanicien.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-tache',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './tache.component.html',
  styleUrl: './tache.component.scss'
})
export default class TacheComponent implements OnInit {
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;

  taches: any[] = [];
  filteredTache: any[] = [];
  dateMinFilter: any = null;
  dateMaxFilter: any = null;
  etatFilter: any = null;
  selectedTache: any = null;
  etats= ["en attente", "en cours", "terminée"];
  message: any = null;
  detailTache: any = null;
  modalRef!: NgbModalRef;
  modalOuverte = false;


  constructor(
    private mecanicienService: MecanicienService,
    private rendezVousService: RendezvousService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllTache();
  }

  getAllTache() {
    const UserInfo = this.authService.getUserInfo();

    this.mecanicienService.getAllTacheMecanicien(UserInfo.id).subscribe({
      next: (resp) => {
        this.taches = resp.data;
        this.applyFilters();
      },
      error: (err) => console.error('Erreur lors de la récupération des taches:', err)
    })
  }

  getRendezVous(rendezVousId: string) {
    this.rendezVousService.getRendezVousById(rendezVousId).subscribe({
      next: (resp) => {
        this.detailTache = resp.data;
        
      },
      error: (err) => console.error('Erreur lors de la récupération des details de la tache:', err)
    })
  }

  updateRole(idTache: string, etat: string) {
    const UserInfo = this.authService.getUserInfo();

    if (this.selectedTache) {
      this.mecanicienService.updateTacheMecanicien(UserInfo.id, idTache, etat, '').subscribe({
        next: (resp) => {
          this.message = "etat change";
          console.log(this.message);
        }
      });

      // this.mouvementStockService.insertMouvementStock(mouvement).subscribe({
      //   next: (resp) => {
      //     console.log("insertion succes");
      //     this.getEtatStock();
      //   },
      //   error: (err) => console.error('erreur insertion', err)
      // });
    }
  }

  applyFilters() {
    this.filteredTache = this.taches.filter((tache) => {
      const dateDebut = new Date(tache.date_debut).toISOString().split('T')[0];
      const dateFin = new Date(tache.date_fin).toISOString().split('T')[0];

      const minFilter = this.dateMinFilter;
      const maxFilter = this.dateMaxFilter;

      // L'intervalle [dateDebut, dateFin] intersecte [minFilter, maxFilter]
      const dateMatch =
        (!minFilter || dateFin >= minFilter) &&
        (!maxFilter || dateDebut <= maxFilter);

      const etatMatch = this.etatFilter ? tache.etat === this.etatFilter : true;

      return dateMatch && etatMatch;
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

  getMois(mois: number): string {
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return moisNoms[mois - 1] || '';
  }

  // open(content: any, tache: any) {
  //   this.selectedTache = tache;
    
  //   this.getRendezVous(tache.id_rendez_vous._id);

  //   if (tache.etat != "terminée") {
  //     this.modalService.open(content, {
  //       centered: true
  //     });
  //   }
  // }

  ouvrirModal(modal: any, tache:any) {
    this.selectedTache = tache;
    
    this.getRendezVous(tache.id_rendez_vous._id);

    // Ouvre la modale et stocke l'instance
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      windowClass: 'custom-modal-size'
    });
  }

  fermerModal() {
    if (this.modalRef) {
      this.modalOuverte = false;
      this.modalRef.dismiss();
    }
  }
}
