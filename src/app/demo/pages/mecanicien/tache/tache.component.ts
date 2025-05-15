import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';
import { MecanicienService } from 'src/app/services/mecanicien/mecanicien.service';
import { ToastrService } from 'ngx-toastr';

interface Tache {
id_vehicule: any;
  _id: string;
  id_rendez_vous: any;
  id_mecanicien: any;
  date_debut: string;
  date_fin: string;
  etat: string;
  facture: boolean;
}
@Component({
  selector: 'app-tache',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tache.component.html',
  styleUrl: './tache.component.scss'
})
export default class TacheComponent implements OnInit {
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;
  
  taches: any[] = [];

  filteredTache: Tache[] = [{
    _id: '',
    id_rendez_vous: {id_client: {nom: '', contact: '', email: ''}},
    id_mecanicien: {nom: '', contact: '', email: ''},
    date_debut: '',
    date_fin: '',
    etat: '',
    facture : false,
    id_vehicule: {marque: '', numero: '', id_modele: {nom: ''}}
  }];

  dateMinFilter: any = null;
  dateMaxFilter: any = null;
  etatFilter: any = null;
  mecanicienFilter: any = null;
  clientFilter: string = "";
  selectedTache: any = null;
  etats = ['en attente', 'en cours', 'terminée'];
  message: any = null;
  detailTache: any = null;
  detailTacheInitial: any = null; // Pour backup initial
  modalRef!: NgbModalRef;
  modalOuverte = false;
  facture_etat :any = null;
  facture_id: any = null;
  userInfo: any = null;
  

  allServices: any[] = [];
  serviceEtArticleChecked: { serviceId: string; checkArticle: '0' | '1' }[] = [];

  constructor(
    private mecanicienService: MecanicienService,
    private rendezVousService: RendezvousService,
    private authService: AuthService,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.getAllTache();
    this.chargerServices();
  }

  getAllTache() {
    
    
    if (this.userInfo.role=="mecanicien") {
      this.mecanicienService.getAllTacheMecanicien(this.userInfo.id).subscribe({
        next: (resp) => {
          this.taches = resp.data;
          this.applyFilters();
        },
        error: (err) => console.error('Erreur lors de la récupération des taches de ce mécanicien:', err)
      });
    }else if (this.userInfo.role=="manager") {
      this.mecanicienService.getAllTaches().subscribe({
        next: (resp) => {
          this.taches = resp.data;
          this.applyFilters();
        },
        error: (err) => console.error('Erreur lors de la récupération des tous les taches:', err)
      });
    }
    
  }



  async validerFacture(vehiculeId: string, clientId:string, serviceEtArticles: any[]) {

    this.mecanicienService.addFacture(vehiculeId,this.selectedTache._id,clientId,serviceEtArticles).subscribe({
      next: (resp) => {
        this.message = resp.message;
        this.toaster.success(this.message, 'Succès', {
          timeOut: 3000,
          progressAnimation: 'decreasing',
          progressBar: true,
        });
      },
      error: (err) => {
        this.toaster.error("Erreur lors de la validation de la facture", 'Erreur', {
          progressBar: true,
          progressAnimation: 'decreasing'
        });
        console.error("Erreur:", err);
      }
    });

    this.updateFactureTacheEtat(this.selectedTache._id, true);
  }

  getRendezVous(rendezVousId: string) {
    this.rendezVousService.getRendezVousById(rendezVousId).subscribe({
      next: (resp) => {
        this.detailTache = structuredClone(resp.data);
        this.detailTacheInitial = structuredClone(resp.data); // Pour reset
        const initialServiceIds = this.detailTache.services.map(service => service._id);

        this.detailTache.services.forEach(service => {
          const entry = this.serviceEtArticleChecked.find(e => e.serviceId === service._id);
          if (entry) {
            entry.checkArticle = '1';
          } else {
            this.serviceEtArticleChecked.push({ serviceId: service._id, checkArticle: '1' });
          }
        });

        // On ne filtre pas `allServices` ici pour garder l'état global
      },
      error: (err) => console.error('Erreur lors de la récupération des détails de la tache:', err)
    });
  }

  chargerServices() {
    this.rendezVousService.getServices().subscribe({
      next: (response) => {
        this.allServices = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des services:', err)
    });
  }

  updateFactureTacheEtat(idTache: string, etat: boolean){

      

      this.mecanicienService.miseAjourFactureEtat(idTache, etat).subscribe({
        next: (resp) => {
          this.selectedTache = resp.data;
          const index = this.filteredTache.findIndex(t => t._id === idTache);
          if (index !== -1) {
            this.filteredTache[index].facture = etat;
          }
        
          const indexOriginal = this.taches.findIndex(t => t._id === idTache);
          if (indexOriginal !== -1) {
            this.taches[indexOriginal].facture = etat;
          }
        
          this.applyFilters(); // Pour forcer le recalcul si nécessaire
          
          
          
          this.message = "Changement d'état de la facture de cette tâche";
          this.toaster.success(this.message, 'Succès', {
            timeOut: 3000,
            progressAnimation: 'decreasing',
            progressBar: true,
          });
        },
        error: (err) => {
          this.toaster.error("Erreur lors de la modification de l'état de la facture de cette tâche", 'Erreur', {
            progressBar: true,
            progressAnimation: 'decreasing'
          });
          console.error("Erreur:", err);
        }
      });
    
  }

  updateRole(idTache: string, etat: string) {
    if (this.selectedTache) {
      this.mecanicienService.updateTacheMecanicien(this.userInfo.id, idTache, etat, '').subscribe({
        next: () => {
          this.message = "Changement d'état de la tâche";
          this.toaster.success(this.message, 'Succès', {
            timeOut: 3000,
            progressAnimation: 'decreasing',
            progressBar: true,
          });
        },
        error: (err) => {
          this.toaster.error("Erreur lors de la modification de l'état de la tâche", 'Erreur', {
            progressBar: true,
            progressAnimation: 'decreasing'
          });
          console.error("Erreur:", err);
        }
      });
    }
  }

  genererFacture(tache_id: string) {
    this.mecanicienService.getFactureByTache(tache_id,this.userInfo.role).subscribe({
      next: (resp) => {
        const facture_id = resp.data;
        console.log('Facture ID récupéré :', facture_id);
  
        this.mecanicienService.genererPdf(facture_id,this.userInfo.role).subscribe({
          next: (response) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `facture_${facture_id}.pdf`;
            link.click();
  
            this.message = "Facturation de la tâche";
            this.toaster.success(this.message, 'Succès', {
              timeOut: 3000,
              progressAnimation: 'decreasing',
              progressBar: true,
            });
          },
          error: (err) => {
            this.toaster.error("Erreur lors de la facturation de la tâche", 'Erreur', {
              progressBar: true,
              progressAnimation: 'decreasing'
            });
            console.error("Erreur:", err);
          }
        });
      },
      error: (err) => console.error('Erreur lors de la récupération de la facture:', err)
    });
  }
  

  applyFilters() {
    this.filteredTache = this.taches.filter((tache) => {
      const dateDebut = new Date(tache.date_debut).toISOString().split('T')[0];
      const dateFin = new Date(tache.date_fin).toISOString().split('T')[0];

      const dateMatch = (!this.dateMinFilter || dateFin >= this.dateMinFilter) &&
                        (!this.dateMaxFilter || dateDebut <= this.dateMaxFilter);
      

      if (this.userInfo.role == 'manager') {
        const mecaMatch = this.mecanicienFilter ? tache.id_mecanicien.nom === this.mecanicienFilter : true;
        const nomMatch = this.clientFilter ? tache.id_rendez_vous.id_client.nom.includes(this.clientFilter) : true;
        return dateMatch && mecaMatch && nomMatch;
      }else{
        const etatMatch = this.etatFilter ? tache.etat === this.etatFilter : true;
        return dateMatch && etatMatch;
      }
    });
  }

  formatDate(date: string): string {
    const dateObject = new Date(date);
    const jour = dateObject.getDate();
    const mois = dateObject.getMonth() + 1;
    const annee = dateObject.getFullYear();
    const heure = dateObject.getHours();
    const minute = dateObject.getMinutes().toString().padStart(2, '0');
    return `${jour} ${this.getMois(mois)} ${annee} à ${heure}:${minute}`;
  }

  getMois(mois: number): string {
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return moisNoms[mois - 1] || '';
  }

  ouvrirModal(modal: any, tache: any) {
    this.selectedTache = tache;
    if (tache.etat === 'en cours') {
      this.etats = ['en cours', 'terminée'];
    }
    this.getRendezVous(tache.id_rendez_vous._id);
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      windowClass: 'custom-modal-size'
    });
  }

  ouvrirModalFacture(modal: any, tache: any) {
    this.selectedTache = tache;
    this.getRendezVous(tache.id_rendez_vous._id);
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
      this.resetData();
    }
  }

  resetData() {
    this.selectedTache = null;
    this.detailTache = null;
    this.detailTacheInitial = null;
    this.message = null;
    this.serviceEtArticleChecked = [];
    this.etats = ['en attente', 'en cours', 'terminée'];
  }

  addNewServiceSupplementaire(): void {
    const usedIds = new Set([
      ...this.detailTache.services.map(s => s._id),
      ...this.getServicesSupplementaires().map(s => s.serviceId)
    ]);

    const availableServices = this.allServices.filter(service => !usedIds.has(service._id));

    if (availableServices.length > 0) {
      this.serviceEtArticleChecked.push({ serviceId: '', checkArticle: '1' });
    }
  }

  removeServiceSupplementaire(index: number): void {
    const supplementaires = this.getServicesSupplementaires();
    const suppToRemove = supplementaires[index];
    const indexGlobal = this.serviceEtArticleChecked.findIndex(
      e => e.serviceId === suppToRemove.serviceId && !this.isInitialService(e.serviceId)
    );
    if (indexGlobal !== -1) {
      this.serviceEtArticleChecked.splice(indexGlobal, 1);
    }
  }

  removeInitialService(serviceId: string): void {
    // Retirer le service de la liste initiale
    const serviceToRemove = this.detailTache?.services.find(s => s._id === serviceId);
    if (serviceToRemove) {
      // Supprimer du tableau des services initiaux
      this.detailTache.services = this.detailTache.services.filter(s => s._id !== serviceId);
  
      // Ajouter à la liste des services supplémentaires si ce n'est pas déjà dedans
      const serviceAlreadyInSupplementary = this.serviceEtArticleChecked.some(e => e.serviceId === serviceToRemove._id);
      if (!serviceAlreadyInSupplementary) {
        this.serviceEtArticleChecked.push({
          serviceId: serviceToRemove._id,
          checkArticle: '1', // Coché par défaut
        });
      }
    }
  }

  get isInitialService(): (id: string) => boolean {
    return (id: string) => this.detailTache?.services.some(service => service._id === id);
  }

  getEntry(serviceId: string) {
    const entry = this.serviceEtArticleChecked.find(e => e.serviceId === serviceId);
    return entry || { serviceId, checkArticle: '0' };
  }

  getServicesSupplementaires() {
    return this.serviceEtArticleChecked.filter(
      entry => !this.detailTache?.services.some(s => s._id === entry.serviceId)
    );
  }

  async valider(): Promise<void> {
    const allServiceIds = [
      ...this.detailTache?.services.map(s => s._id) || [],
      ...this.getServicesSupplementaires().map(s => s.serviceId)
    ];
  
    const payload = allServiceIds.map(serviceId => {
      const entry = this.getEntry(serviceId);
      return {
        serviceId: entry.serviceId,
        checkArticle: entry.checkArticle === '1' ? '1' : '0'
      };
    });
    
    
    await this.validerFacture(this.selectedTache.id_vehicule._id, this.selectedTache.id_rendez_vous.id_client, payload);
    
    
    // console.log(this.selectedTache.id_vehicule._id, this.selectedTache.id_rendez_vous.id_client);
    
    this.fermerModal();
    

    console.log('✅ Données à envoyer:', payload);
  }

  isAjoutServicePossible(): boolean {
    const servicesInitiauxIds = this.detailTache?.services.map(s => s._id) || [];
    const servicesSuppIds = this.getServicesSupplementaires().map(s => s.serviceId);
    const servicesUtilisés = new Set([...servicesInitiauxIds, ...servicesSuppIds]);
    return this.allServices.some(s => !servicesUtilisés.has(s._id));
  }
}
