// angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  nom = "";
  email = "";
  contact = "";
  password = "";

  constructor(private authService: AuthService) {}

  onRegister() {
    const utilisateur = { email: this.email, password: this.password, nom: this.nom, contact: this.contact };

    this.authService.register(utilisateur).subscribe(
      (response) => {
        // Sauvegarde le token JWT dans le localStorage
        this.authService.saveToken(response.token);
        console.log("L'enregistrement a été reussi", response);
      },
      (error) => {
        console.error("Erreur lors de l'enregistrement", error);
      }
    );
  }
  
}
