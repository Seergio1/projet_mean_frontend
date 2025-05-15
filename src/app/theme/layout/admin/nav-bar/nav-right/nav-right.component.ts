// Angular import
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/client/notification.service';
import { ToastrService } from 'ngx-toastr';
// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  standalone: true
})
export class NavRightComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo: any = null;
  notifications: any[] = [];
  filteredNotifications: any[] = [];
  idUtilisateur = this.authService.getUserInfo().id;
  notifNonLues: number = 0;

  constructor(private authService: AuthService, private router: Router, private notifService: NotificationService, private toaster: ToastrService) { }

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo(); // Appel de la méthode pour récupérer les données
    this.getNotifications();

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);  // Utilise router.navigate pour rediriger sans recharger la page
  }

  getNotifications() {
    this.notifService.getNotificationsByIdClient(this.idUtilisateur).subscribe({
      next: (response) => {
        // console.log("Notifications reçues :", response.data);
        this.notifications = response.data;
        this.filteredNotifications = [...this.notifications];
        this.notifNonLues = this.filteredNotifications.filter(notification => notification.lu === false).length;
        if (this.notifNonLues > 0) {
          this.toaster.success("Vous avez " + this.notifNonLues + " notification(s) non lu(e)s", 'Succès', {
            timeOut: 3000,
            progressAnimation: 'decreasing',
            progressBar: true,
            positionClass: 'toast-bottom-right'
          });
        }

      },
      error: (error) => {
        console.error('Erreur lors de la récupération des notifications', error);
      }
    });
  }

  basculerPleinEcran() {
    const elem = document.documentElement as any;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); // Safari
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); // IE11
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }



  filterNotifications(event: any) {
    const filterType = event.target.value;

    if (filterType === 'tous') {
      this.filteredNotifications = [...this.notifications];
    } else if (filterType === 'lu') {
      this.filteredNotifications = this.notifications.filter(notif => notif.lu === true);
    } else if (filterType === 'nonlu') {
      this.filteredNotifications = this.notifications.filter(notif => notif.lu === false);
    }
  }

  updateNotification(id_notification: string, newEtat: boolean) {
    this.notifService.updateEtatNotification(id_notification, newEtat).subscribe({
      next: () => {
        // console.log('État mis à jour');
        this.getNotifications(); // Rafraîchir la liste
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la notification', error);
      }
    });
  }

  marquerTousLu() {
    this.notifService.marquerTousLu(this.idUtilisateur).subscribe({
      next: () => {
        // console.log('Toutes les notifications ont été marquées comme lues');
        this.getNotifications(); // Recharger les notifications pour afficher les mises à jour
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de l\'état des notifications', error);
      }
    });
  }
}
