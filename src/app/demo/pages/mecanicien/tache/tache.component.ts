import { CommonModule } from '@angular/common';
import { Component,ElementRef,OnInit, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';
import { MecanicienService } from 'src/app/services/mecanicien/mecanicien.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tache',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './tache.component.html',
  styleUrl: './tache.component.scss',
  standalone: true
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


  allServices: any[] = [];
  articleChecked: any[] = [];
  serviceEtArticleChecked:any[] = [];


  constructor(
    private mecanicienService: MecanicienService,
    private rendezVousService: RendezvousService,
    private authService: AuthService,
    private modalService: NgbModal,
    private toaster:ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllTache();
    this.chargerServices();
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

  chargerServices() {
    this.rendezVousService.getServices().subscribe({
      next: (response) => {
        this.allServices = response.data;
        this.detailTache?.services.forEach((service) => {
          this.articleChecked[service._id] = 0;
        });
        // this.selectedServices = this.services.map(service => ({ _id: service._id, selected: false, nom: service.nom }));
        // console.log(this.services);

      },
      error: (err) => console.error('Erreur lors du chargement des services:', err)
    });
  }

  updateRole(idTache: string, etat: string) {
    const UserInfo = this.authService.getUserInfo();

    if (this.selectedTache) {
      console.log(UserInfo.id, idTache, etat);
      
      this.mecanicienService.updateTacheMecanicien(UserInfo.id, idTache, etat, '').subscribe({
        next: (resp) => {
          this.message = "Changement d\'etat de la tache";
          this.toaster.success(this.message,'Succès',{
            timeOut: 3000,  
            progressAnimation:"decreasing",
            progressBar: true,
          });
        },
        error: (err) => {
          this.toaster.error('Erreur lors de la modification de l\'etat de la tache','Erreur',{
            progressBar: true,
            // closeButton: true,
            progressAnimation:"decreasing"
          })
          console.error('Erreur lors de la modification de l\'etat de la tache:', err)
        }
      });

  //   "serviceEtArticles": [
  //   {
  //     "serviceId": "67d30ee48a5297b7577f5367",
  //     "checkArticle": 1
  //   },
  //   {
  //     "serviceId": "67edb288b35e9ab1dece8cea",
  //     "checkArticle": 0
  //   }
  // ]

  

      // this.mecanicienService.addFacture(this.detailTache.id_vehicule._id, this.detailTache.id_client, this.detailTache.serviceEtArticles).subscribe({
      //   next: (resp) => {
      //     console.log("insertion succes");
      //   },
      //   error: (err) => console.error('erreur insertion', err)
      // });
      

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

    if (tache.etat == "en cours") {
      this.etats = ["en cours", "terminée"];
    }
    
    this.getRendezVous(tache.id_rendez_vous._id);

    // Ouvre la modale et stocke l'instance
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      windowClass: 'custom-modal-size'
    });
  }

  ouvrirModalFacture(modal: any, tache:any) {
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
