// angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  // Méthode de connexion
  onLogin() {
    const credentials = { email: this.email, password: this.password };
    
    this.authService.login(credentials).subscribe(
      (response) => {
        // Sauvegarde le token JWT dans le localStorage
        this.authService.saveToken(response.token);
        console.log("Connexion réussie", response);
      },
      (error) => {
        console.error('Erreur lors de la connexion', error);
      }
    );
  }
}
