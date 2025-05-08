// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [RouterModule,FormsModule,CommonModule],
  standalone:true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  nom = "";
  email = "";
  contact = "";
  password = "";

  constructor(private authService: AuthService,private router: Router,private toaster:ToastrService) {}

  onRegister() {
    const utilisateur = { email: this.email, password: this.password, nom: this.nom, contact: this.contact };

    this.authService.register(utilisateur).subscribe(
      (response) => {

        console.log("L'enregistrement a été reussi", response);
        this.toaster.success("L'enregistrement a été reussi","Succès",{
          progressBar: true,
          // closeButton: true,
          progressAnimation:"decreasing"
        })
        this.router.navigate([('/login')])
      },
      (error) => {
        console.error(error.error.message);
        this.toaster.error(error.error.message,'Erreur',{
          progressBar: true,
          // closeButton: true,
          progressAnimation:"increasing"
        })
      }
    );
  }

}
