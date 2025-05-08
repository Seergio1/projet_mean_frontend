import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './utils/auth.guard';
import { AuthService } from './services/auth.service';
import { UnauthorizedComponent } from './demo/error/unauthorized/unauthorized.component';


const routes: Routes = [

  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {role : ["manager"]},
    children: [

      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'profil',
        loadComponent: () => import('./demo/pages/manager/profil/profil.component')
      },
      {
        path: 'mouvement',
        loadComponent: () => import('./demo/pages/manager/mouvement-stock/mouvement-stock.component')
      },
      {
        path: 'etat-stock',
        loadComponent: () => import('./demo/pages/manager/etat-stock/etat-stock.component')
      },
    ]
  },


  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {role : ["mecanicien","manager"]},
    children: [
      {
        path: 'taches',
        loadComponent: () => import('./demo/pages/mecanicien/tache/tache.component')
      },
    ]
  },

  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {role : ["client","mecanicien","manager"]},
    children: [
      {
        path: 'coucou',
        loadComponent: () => import('./demo/pages/liste-taches/liste-taches.component')
      },
      {
        path: 'commentaires',
        loadComponent: () => import('./demo/pages/client/commentaires/commentaires.component')
      },
      
      {
        path: 'rendez-vous/prise',
        loadComponent: () => import('./demo/rendezvous/prise/prise.component')
      },
      {
        path: 'rendez-vous/liste',
        loadComponent: () => import('./demo/rendezvous/liste/liste.component')
      },

      {
        path: 'vehicule/ajout',
        loadComponent: () => import('./demo/vehicule/ajout/ajout.component')
      },
      {
        path: 'vehicule/liste',
        loadComponent: () => import('./demo/vehicule/liste/liste.component')
      },

      {
        path: 'devis/demande',
        loadComponent: () => import('./demo/devis/demande-devis/demande-devis.component')
      },
      {
        path: 'devis/historique',
        loadComponent: () => import('./demo/devis/historique-devis/historique-devis.component')
      },
      {
        path: 'service/historique',
        loadComponent: () => import('./demo/service/historique-service/historique-service.component')
      },
      {
        path: 'facture/liste',
        loadComponent: () => import('./demo/facture/liste-facture/liste-facture.component')
      },
    ]
  },

  {
    path: 'unauthorized',
    component: UnauthorizedComponent  // Ajoute cette route
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthService],
})
export class AppRoutingModule {}
