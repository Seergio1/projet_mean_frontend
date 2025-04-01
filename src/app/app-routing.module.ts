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
    data: {role : ["client","mecanicien"]},
    children: [

      {
        path: 'default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },

      // nouvelle route
      {
        path: 'rendez-vous/prise',
        loadComponent: () => import('./demo/rendezvous/prise/prise.component')
      },
      {
        path: 'rendez-vous/liste',
        loadComponent: () => import('./demo/rendezvous/liste/liste.component')
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
