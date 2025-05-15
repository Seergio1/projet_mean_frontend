import { CommonModule } from '@angular/common';
import { Component,ElementRef,OnInit, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { DevisService } from 'src/app/services/client/devis.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';


@Component({
  selector: 'app-historique-devis',
  imports: [CommonModule,FormsModule],
  templateUrl: './historique-devis.component.html',
  styleUrl: './historique-devis.component.scss'
})
export default class HistoriqueDevisComponent implements OnInit{
  @ViewChild('modalDevisContainer', { static: false }) modalDevisContainer!: ElementRef;
  constructor(
    private authService: AuthService,
    private devisService: DevisService,
     private rendezVousService: RendezvousService,
     private modalService: NgbModal,
  ){}

  userInfo = null;
  message = "";
  historiqueDevis: any[] = [];
  vehicules: any[] = [];
   modalRef!: NgbModalRef;
   modalOuverte = false;
   dvs:any[] =[]

    // filtre et pagination variables
    filteredDevis: any[] = [];  // Liste après application des filtres
    paginatedDevis: any[] = [];  // Liste paginée
    dateFilter: string = '';  // Filtre pour la date
    // etatFilter: string = '';  // Filtre pour l'état
    currentPage: number = 1;
    itemsPerPage: number = 5;  // Nombre d'éléments par page
    totalPages: number = 0;
    vehiculeFilter:string

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.getClientHistoriqueDevis();
    this.chargerVehicules();
  }

  chargerVehicules() {
    this.rendezVousService.getVehicules(this.userInfo.id).subscribe({
      next: (response) => {
        this.vehicules = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des véhicules:', err)
    });
  }

  getClientHistoriqueDevis() {
    if (!this.userInfo || !this.userInfo.id) {
      console.error('Utilisateur non authentifié ou ID manquant');
      return;
    }
    this.devisService.historiqueDevis(this.userInfo.id).subscribe({
      next: (response) => {
        // console.log(response);
        this.message = response.message;
        this.historiqueDevis = response.data;
        // console.log(response.data);
        this.applyFilters();

      },
      error: (err) => console.error('Erreur lors de la récupération des historiques des devis:', err)
    });
  }

  applyFilters() {
    this.filteredDevis = this.historiqueDevis.filter((devis) => {
      // Extraire la date sans l'heure de rdv.date et la comparer avec dateFilter
      const rdvDate = new Date(devis.date_demande).toISOString().split('T')[0]; // Format "YYYY-MM-DD"


      const dateMatch = this.dateFilter ? rdvDate === this.dateFilter : true;
      // const etatMatch = this.etatFilter ? rdv.etat === this.etatFilter : true;
      const vehiculeMatch = this.vehiculeFilter ? devis.id_vehicule.modele === this.vehiculeFilter :true

      // return dateMatch && etatMatch;
      return dateMatch && vehiculeMatch;
    });

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredDevis.length / this.itemsPerPage);
    this.paginatedDevis = this.filteredDevis.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }


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

  formatPrix(prix: number): number {
    return prix != null ? prix : 0;
  }

  getMontantMateriel(histo:any[]): any {
    let total = 0.0;

    for (let index = 0; index < histo.length; index++) {
     let listArticle = histo[index].articles;
     for (let m = 0; m < listArticle.length; m++) {
      const article = listArticle[m];
      total += article.id_article.prix
     }

    }

    return total != null ? total : 0;
  }

  getMontantService(histo:any[]): any {
    let total = 0.0;

    for (let index = 0; index < histo.length; index++) {
     let listService = histo[index].services;
     for (let m = 0; m < listService.length; m++) {
      const service = listService[m];
      total += service.prix
     }

    }

    return total != null ? total : 0;
  }
  getTotalMontant(histo: any[]): number {
    let totalMateriel = this.getMontantMaterielValeur(histo);
    let totalService = this.getMontantServiceValeur(histo);

    let total = totalMateriel + totalService;

    return total;
}

getMontantMaterielValeur(histo: any[]): number {
    let total = 0.0;
    for (let index = 0; index < histo.length; index++) {
        let listArticle = histo[index].articles;
        for (let m = 0; m < listArticle.length; m++) {
            total += listArticle[m].id_article.prix;
        }
    }
    return total;
}

getMontantServiceValeur(histo: any[]): number {
    let total = 0.0;
    for (let index = 0; index < histo.length; index++) {
        let listService = histo[index].services;
        for (let m = 0; m < listService.length; m++) {
            total += listService[m].prix;
        }
    }
    return total;
}

  ouvrirModal(modal: any, devisHisto: any[]) {
    if (!devisHisto) {
      console.error("Aucun devis sélectionné");
      return;
    }


    this.dvs = Array.isArray(devisHisto) ? devisHisto : [devisHisto];

    // Ouvre la modale et stocke l'instance
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      // size: 'lg',
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
