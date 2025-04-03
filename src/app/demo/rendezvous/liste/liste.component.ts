import { CommonModule } from '@angular/common';
import { Component,ElementRef,OnInit, ViewChild } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TacheService } from 'src/app/services/client/tache.service';


@Component({
  selector: 'app-liste',
  imports: [CommonModule,FormsModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
  standalone: true
})
export default class ListeComponent implements OnInit {
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;

  constructor(
    private rendezVousService: RendezvousService,
    private authService: AuthService,
    private modalService: NgbModal,
    private tacheService: TacheService
  ) {}

  userInfo = null;
  allRenderVous: any[] = [];
  message = '';
  rdv: any[] = [];
  modalRef!: NgbModalRef;
  modalOuverte = false;
  indexRdv: number = -1;
  etatTache :any = null


  // filtre et pagination variables
  filteredRdv: any[] = [];  // Liste après application des filtres
  paginatedRdv: any[] = [];  // Liste paginée
  dateFilter: string = '';  // Filtre pour la date
  etatFilter: string = '';  // Filtre pour l'état
  currentPage: number = 1;
  itemsPerPage: number = 5;  // Nombre d'éléments par page
  totalPages: number = 0;



  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.getClientRendezVous();

  }

  getClientRendezVous() {
    if (!this.userInfo || !this.userInfo.id) {
      console.error('Utilisateur non authentifié ou ID manquant');
      return;
    }
    this.rendezVousService.getRendezVousClient(this.userInfo.id).subscribe({
      next: (response) => {
        // console.log(response);
        this.message = response.message;
        this.allRenderVous = response.data;
        this.applyFilters(); // Appliquer les filtres après avoir récupéré les rendez-vous
      },
      error: (err) => console.error('Erreur lors de la récupération des rendez-vous:', err)
    });
  }

  getEtatTache(rendezVousId: string) {
    if (!rendezVousId) {
      console.error("L'ID du rendez-vous est invalide:", rendezVousId);
      return;
    }
    this.tacheService.getEtatTache(rendezVousId).subscribe({
      next: (response) => {
        // console.log(response);
        this.etatTache = response
      },
      error: (err) => console.error("Erreur lors de la récupération de l'etat de la tâche:", err)
    });
  }

  annulerRendezVous(rendezVousId: string, type: string): void {
    // console.log(rendezVousId);

    if (!rendezVousId) {
      console.error("L'ID du rendez-vous est invalide:", rendezVousId);
      return;
    }
    if (type=="annulation") {
      this.rendezVousService.annulerRendezVous(rendezVousId,type).subscribe({
        next: (response) => {
          console.log(response);
        },error: (err) => console.error('Erreur lors de l\'annulation du rendezVous', err)
      });
    }else if(type=="acceptation"){
      this.rendezVousService.annulerRendezVous(rendezVousId,type).subscribe({
        next: (response) => {
          console.log(response);
        },error: (err) => console.error('Erreur lors de l\'annulation du rendezVous', err)
      });
    }

  }

  // Appliquer les filtres de date et d'état
  applyFilters() {
    this.filteredRdv = this.allRenderVous.filter((rdv) => {
      // Extraire la date sans l'heure de rdv.date et la comparer avec dateFilter
      const rdvDate = new Date(rdv.date).toISOString().split('T')[0]; // Format "YYYY-MM-DD"

      const dateMatch = this.dateFilter ? rdvDate === this.dateFilter : true;
      const etatMatch = this.etatFilter ? rdv.etat === this.etatFilter : true;

      return dateMatch && etatMatch;
    });

    this.updatePagination();
  }


  // Mettre à jour la pagination
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRdv.length / this.itemsPerPage);
    this.paginatedRdv = this.filteredRdv.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  // Changer de page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  showAll() {
    this.itemsPerPage = this.filteredRdv.length;
    this.updatePagination();
  }

  // Formatage de la date
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

  // Ouvrir la modal
 ouvrirModal(modal: any, rendezVous: any[], index: number) {
    if (!rendezVous) {
      console.error("Aucun rendez-vous sélectionné");
      return;
    }


    this.rdv = Array.isArray(rendezVous) ? rendezVous : [rendezVous];
    this.indexRdv = index;
    if (this.rdv.length>0) {
      this.getEtatTache(this.rdv[this.indexRdv]._id)
    }

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
