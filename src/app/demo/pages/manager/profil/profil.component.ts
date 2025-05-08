import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilService } from 'src/app/services/manager/profil.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
  standalone: true
})
export default class ProfilComponent implements OnInit {
  utilisateurs: any[] = [];
  selectedProfil: any = null;
  roleInserer: any = null;
  roles = ["client", "mecanicien", "manager"];
  message: any = null;

  roleFilter: string | null = null;
  nomFilter: string | null = null;
  filterUser: any[] = [];
  


  constructor(private profilService: ProfilService,
    private modalService: NgbModal,
    private toaster:ToastrService
  ) {

  }

  ngOnInit(): void {
    this.getAllProfil();
  }

  getAllProfil() {
    this.profilService.findUtilisateurs().subscribe({
      next: (resp) => {
        this.utilisateurs = resp.data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('erreur lors du chargements des profils');
      }
    })
  }

  applyFilters() {
    this.filterUser = this.utilisateurs.filter((user) => {
      const roleMatch = this.roleFilter ? user.role === this.roleFilter : true;

      const nomMatch = this.nomFilter ? user.nom.toLowerCase().includes(this.nomFilter) : true;
      return roleMatch && nomMatch;
    });
  }

  open(content: any, profil: any) {
    this.selectedProfil = profil;
    this.modalService.open(content, {
      centered: true
    });
  }

  updateRole(idProfil: string, role: string) {
    if (this.selectedProfil) {
      this.profilService.updateRole(idProfil, role).subscribe({
        next: (resp) => {
          this.message = "Changement de rôle effectué";
          this.toaster.success(this.message, 'Succès', {
            timeOut: 3000,
            progressAnimation: 'decreasing',
            progressBar: true,
          });
          this.applyFilters();
        },
        error: (err) => {
          this.toaster.error("Erreur lors du changement de rôle", 'Erreur', {
            progressBar: true,
            progressAnimation: 'decreasing'
          });
          console.error("Erreur:", err);
        }
      });
    }
  }

}
