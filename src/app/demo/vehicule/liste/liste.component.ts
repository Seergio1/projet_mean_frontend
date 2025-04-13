import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { VehiculeService } from 'src/app/services/client/vehicule.service';

@Component({
  selector: 'app-liste',
  imports: [CommonModule,FormsModule],
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.scss']
})
export default class ListeComponent implements OnInit{
  constructor(
        private vehiculeService: VehiculeService,
        private authService: AuthService
      ) {}

  vehicules: any[] = [];
  modeles: any[] = [];

  utilisateurId = ""

    // filtre et pagination variables
    filteredService: any[] = [];  // Liste après application des filtres
    paginatedService: any[] = [];  // Liste paginée
    // etatFilter: string = '';  // Filtre pour l'état
    currentPage: number = 1;
    itemsPerPage: number = 5;  // Nombre d'éléments par page
    totalPages: number = 0;
    modeleFilter: string

  ngOnInit(): void {
    this.utilisateurId = this.authService.getUserInfo()?.id || '';
    this.chargerVehicules();
    this.chargerModeles();
  }

  chargerVehicules() {
    this.vehiculeService.getVehicules(this.utilisateurId).subscribe({
      next: (response) => {
        this.vehicules = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des véhicules:', err)
    });
  }
  chargerModeles() {
    this.vehiculeService.getModeles().subscribe({
      next: (response) => {
        this.modeles = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des modèles:', err)
    });
  }

  applyFilters() {
    this.filteredService = this.modeles.filter((modele) => {
      const modeleMatch = this.modeleFilter ? modele._id === this.modeleFilter :true
      return modeleMatch;
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
}
