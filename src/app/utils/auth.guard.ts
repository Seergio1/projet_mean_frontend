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
    const requiredRole = next.data['role'];  // Récupère le rôle requis depuis les données de la route

    if (this.authService.isAuthenticated()) {
      console.log(requiredRole);
      
      if (requiredRole && !this.authService.hasAnyRole(requiredRole)) {
        // Si l'utilisateur n'a pas le rôle requis
        this.router.navigate(['/unauthorized']);  // Redirige vers une page d'accès non autorisé
        return false;
      }
      return true;  // L'utilisateur est authentifié et a le bon rôle
    } else {
      this.router.navigate(['/login']);  // L'utilisateur n'est pas authentifié, redirige vers la page de connexion
      return false;
    }
  }
}


