// Angular import
import { Component,OnInit } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements  OnInit{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo: any = null;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo(); // Appel de la méthode pour récupérer les données
    console.log(this.userInfo);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);  // Utilise router.navigate pour rediriger sans recharger la page
  }
}
