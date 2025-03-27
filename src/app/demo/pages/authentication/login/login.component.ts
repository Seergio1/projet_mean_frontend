// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [RouterModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  email = 'giorakotomalala@gmail.com';
  password = 'Client1';

  constructor(private authService: AuthService,private router: Router,private toaster:ToastrService) {}

  // Méthode de connexion
  onLogin() {
    const credentials = { email: this.email, password: this.password };


    this.authService.login(credentials).subscribe(
      (response) => {

        // Sauvegarde du token et des info user dans les localStorage
        this.authService.saveToken(response.token);
        this.authService.saveUserInfo(response.user)
        this.router.navigate([('/default')])
        console.log("Connexion réussie", response);
      },
      (error) => {
        console.error(error.error.message);
        this.toaster.error(error.error.message,'Erreur',{
          progressBar: true,
          // closeButton: true,
          progressAnimation:"decreasing"
        })
      }
    );
  }
}
