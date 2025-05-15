import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // Cette méthode est appelée pour chaque route protégée
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole: string[] = next.data['role'];  // Récupère le rôle requis depuis les données de la route
   

    if (this.authService.isAuthenticated()) {
      
      if (requiredRole && !this.authService.hasAnyRole(requiredRole)) {
        // Si l'utilisateur n'a pas le rôle requis
        this.router.navigate(['/unauthorized']);  
        return false;
      }
      return true;  
    } else {
      this.router.navigate(['/login']);  
      return false;
    }
  }
}


