import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilService } from 'src/app/services/manager/profil.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export default class ProfilComponent implements OnInit {
  utilisateurs: any[] = [];
  selectedProfil: any = null;
  roleInserer: any = null;
  roles = ["client", "mecanicien", "manager"];
  message: any = null;

  constructor(private profilService: ProfilService,
    private modalService: NgbModal
  ) {

  }

  ngOnInit(): void {
    this.getAllProfil();
  }

  getAllProfil() {
    this.profilService.findUtilisateurs().subscribe({
      next: (resp) => {
        this.utilisateurs = resp.data;
      },
      error: (err) => {
        console.error('erreur lors du chargements des profils');
      }
    })
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
          this.message = "role change";
          console.log(this.message);
        }
      });

      // this.mouvementStockService.insertMouvementStock(mouvement).subscribe({
      //   next: (resp) => {
      //     console.log("insertion succes");
      //     this.getEtatStock();
      //   },
      //   error: (err) => console.error('erreur insertion', err)
      // });
    }
  }

}
