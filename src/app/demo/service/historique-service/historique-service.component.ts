import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { HistoriqueServiceService } from 'src/app/services/client/historique-service.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';

@Component({
  selector: 'app-historique-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-service.component.html',
  styleUrl: './historique-service.component.scss'
})
export default class HistoriqueServiceComponent implements OnInit {
  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.getClientHistoriqueService();
    this.chargerVehicules();
  }
  constructor(
    private authService: AuthService,
    private histoService: HistoriqueServiceService,
    private modalService: NgbModal,
    private rendezVousService: RendezvousService,
  ) { }

  userInfo = null;
  message = "";
  historiqueService: any[] = [];
  vehicules: any[] = [];
  modalRef!: NgbModalRef;
  modalOuverte = false;
  srv: any[] = []

  // filtre et pagination variables
  filteredService: any[] = [];  // Liste après application des filtres
  paginatedService: any[] = [];  // Liste paginée
  dateFilter: string = '';  // Filtre pour la date
  // etatFilter: string = '';  // Filtre pour l'état
  currentPage: number = 1;
  itemsPerPage: number = 5;  // Nombre d'éléments par page
  totalPages: number = 0;
  vehiculeFilter: string

  chargerVehicules() {
    this.rendezVousService.getVehicules(this.userInfo.id).subscribe({
      next: (response) => {
        this.vehicules = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des véhicules:', err)
    });
  }

  getClientHistoriqueService(){
    if (!this.userInfo || !this.userInfo.id) {
      console.error('Utilisateur non authentifié ou ID manquant');
      return;
    }
    this.histoService.historiqueService(this.userInfo.id).subscribe({
      next: (response) => {
        this.message = response.message
        this.historiqueService = response.data;
        console.log(response.data);
        this.applyFilters();
      },
      error: (err) => console.error('Erreur lors de la récupération des historiques:',err)
    });
  }

  applyFilters() {
    this.filteredService = this.historiqueService.filter((service) => {
      // Extraire la date sans l'heure de rdv.date et la comparer avec dateFilter
      const rdvDate = new Date(service.date).toISOString().split('T')[0]; // Format "YYYY-MM-DD"

      const dateMatch = this.dateFilter ? rdvDate === this.dateFilter : true;

      const vehiculeMatch = this.vehiculeFilter ? service.id_vehicule.modele === this.vehiculeFilter :true

      // return dateMatch && etatMatch;
      return dateMatch && vehiculeMatch;
    });
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredService.length / this.itemsPerPage);
    this.paginatedService = this.filteredService.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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

    getMontantMateriel(serviceHistorique:any[]): any {
    let total = 0.0;

    for (let index = 0; index < serviceHistorique.length; index++) {
     let listArticle = serviceHistorique[index].articles;
     for (let m = 0; m < listArticle.length; m++) {
      const article = listArticle[m];
      total += article.id_article.prix
     }

    }

    return total != null ? total : 0;
  }
  getMontantService(service:any[]): any {
    let total = 0.0;

    for (let index = 0; index < service.length; index++) {
     let listService = service[index].services;
     for (let m = 0; m < listService.length; m++) {
      const service = listService[m];
      total += service.prix
     }

    }

    return total != null ? total : 0;
  }
  getTotalMontant(service: any[]): number {
    let totalMateriel = this.getMontantMaterielValeur(service);
    let totalService = this.getMontantHistoriqueValeur(service);

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
getMontantHistoriqueValeur(histo: any[]): number {
  let total = 0.0;
  for (let index = 0; index < histo.length; index++) {
      let listService = histo[index].services;
      for (let m = 0; m < listService.length; m++) {
          total += listService[m].prix;
      }
  }
  return total;
}

  ouvrirModal(modal: any, serviceHisto: any[]) {
    if (!serviceHisto) {
      console.error("Aucun devis sélectionné");
      return;
    }

    this.srv = Array.isArray(serviceHisto) ? serviceHisto : [serviceHisto];

    // Ouvre la modale et stocke l'instance
    this.modalRef = this.modalService.open(modal, {
      centered: true,
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
