import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { VehiculeService } from 'src/app/services/client/vehicule.service';

@Component({
  selector: 'app-ajout',
  imports: [FormsModule, CommonModule],
  templateUrl: './ajout.component.html',
  styleUrls: ['./ajout.component.scss']
})
export default class AjoutComponent implements OnInit {
    constructor(
      private vehiculeService: VehiculeService,
      private authService: AuthService
    ) {}

    input = {
      utilisateurId: '',
      id_modele: '',
      numero: '',
      marque: '',
    }
    modeles: any[] = [];

    message = ''

  ngOnInit(): void {
    this.input.utilisateurId = this.authService.getUserInfo()?.id || '';
    this.chargerModeles();
  }

  chargerModeles() {
    this.vehiculeService.getModeles().subscribe({
      next: (response) => {
        this.modeles = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement des modèles:', err)
    });
  }

  addVehicule() {
    if (!this.input.utilisateurId || !this.input.id_modele || this.input.marque == '' || this.input.numero == '') {
      this.message = "Veuillez remplir tous les champs.";
      return;
    }
    console.log(this.input);

    this.vehiculeService.addVehiculeToUtilisateur(this.input).subscribe({
      next: () => {
        this.message = "Véhicule ajouté avec succès !";
      },
      error: (err) => {
        console.error("Erreur lors de la validation du rendez-vous:", err);
        this.message = err.error.message;
      }
    });
  }

}
