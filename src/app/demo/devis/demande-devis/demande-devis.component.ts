import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DevisService } from 'src/app/services/client/devis.service';
import { AuthService } from 'src/app/services/auth.service';
import { RendezvousService } from 'src/app/services/client/rendezvous.service';
import { ArticleService } from 'src/app/services/client/article.service';


@Component({
  selector: 'app-demande-devis',
  imports: [FormsModule, CommonModule],
  templateUrl: './demande-devis.component.html',
  styleUrl: './demande-devis.component.scss',
  standalone: true
})
export default class DemandeDevisComponent implements OnInit {


  devis: any[] = [];
  vehicules: any[] = [];
  articles: any[] = [];
  services: any[] = [];

  body = {
    clientId: '',
    vehiculeId: '',
    servicesIds: [],
    artCheck: 0,
    tabArticles: []
  }

  // variable utils service
  selectedServices: any[] = [];
  selectionServiceOuvert = false;
  tempSelectedServices: any[] = [];
  // ---------------------------

  // variable utils articles
  selectedArticles: any[] = []
  selectionArticleOuvert = false;
  tempSelectedArticles: any[] = [];
  // ---------------------------

  message = "";

  constructor(
    private devisService: DevisService,
    private authService: AuthService,
    private rendezVousService: RendezvousService,
    private articleService: ArticleService

  ) { }

  ngOnInit(): void {
    this.body.clientId = this.authService.getUserInfo()?.id || '';
    this.chargerServices();
    this.chargerVehicules();
    // this.chargerArticles();
  }

  chargerVehicules() {
    this.rendezVousService.getVehicules(this.body.clientId).subscribe({
      next: (response) => {
        this.vehicules = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des véhicules:', err)
    });
  }

// partie chargement article
  chargerArticles() {
    this.articleService.getArticles().subscribe({
      next: (response) => {
        this.articles = response.data;
        this.selectedArticles = this.articles.map(article => ({ _id: article._id, selected: false, nom: article.nom }));
        console.log(this.articles);
        
      },
      error: (err) => console.error('Erreur lors du chargement des véhicules:', err)
    });
  }

  ouvrirSelectionArticle() {
    this.selectionArticleOuvert = true;

    // Copier l'état actuel pour annulation possible
    this.tempSelectedArticles = this.selectedArticles.map(article => ({
      ...article,
      selected: article.selected
    }));
  }

  fermerSelectionArticle(annuler = false) {
    if (annuler) {
      // Remettre l'état initial
      this.selectedArticles = this.tempSelectedArticles.map(article => ({
        ...article
      }));
    }
    this.selectionArticleOuvert = false;
  }

  validerSelectionArticle() {
    this.body.tabArticles = this.selectedArticles
      .filter(article => article.selected)
      .map(article => article._id);

    this.selectionArticleOuvert = false;
  }

  getArticleNameById(articleId: string): string {
    const article = this.selectedArticles.find(a => a._id === articleId);
    return article ? article.nom : '';
  }
  // -----------------------------------------------------------


  // partie chargement service
  chargerServices() {
    this.rendezVousService.getServices().subscribe({
      next: (response) => {
        this.services = response.data;
        this.selectedServices = this.services.map(service => ({ _id: service._id, selected: false, nom: service.nom }));
        // console.log(this.services);

      },
      error: (err) => console.error('Erreur lors du chargement des services:', err)
    });
  }


  ouvrirSelectionService() {
    this.selectionServiceOuvert = true;

    // Copier l'état actuel pour annulation possible
    this.tempSelectedServices = this.selectedServices.map(service => ({
      ...service,
      selected: service.selected
    }));
  }

  fermerSelectionService(annuler = false) {
    if (annuler) {
      // Remettre l'état initial
      this.selectedServices = this.tempSelectedServices.map(service => ({
        ...service
      }));
    }
    this.selectionServiceOuvert = false;
  }

  validerSelectionService() {
    this.body.servicesIds = this.selectedServices
      .filter(service => service.selected)
      .map(service => service._id);

    this.selectionServiceOuvert = false;
  }

  getServiceNameById(serviceId: string): string {
    const service = this.selectedServices.find(s => s._id === serviceId);
    return service ? service.nom : '';
  }

  // demande devis
  demandeDevis() {
    // Vérification des champs obligatoires
    if (!this.body.vehiculeId || !this.body.servicesIds.length || !this.body.clientId) {
      this.message = "Veuillez renseigner tous les champs.";
      return;
    }
  
    const data = {
      vehiculeId: this.body.vehiculeId,
      clientId: this.body.clientId,
      servicesIds: this.body.servicesIds,
      artCheck: this.body.artCheck || 0,  // Par défaut 0 si non spécifié
    };
  
    console.log(data);
  
    // Appel au service de demande de devis
    this.devisService.demandeDevis(data).subscribe({
      next: (response) => {
        // Si la réponse est correcte, on met à jour le message
        this.message = response.message || "Demande de devis réussie.";
      },
      error: (err) => {
        console.error('Erreur lors de la demande de devis:', err);
  
        // Gestion des erreurs en fonction de la réponse du serveur
        this.message = err.error?.message || "Erreur lors de la demande de devis.";
      }
    });
  }
  
}
