import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { er } from '@fullcalendar/core/internal-common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { MouvementStockService } from 'src/app/services/manager/mouvement-stock.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-etat-stock',
  imports: [CommonModule, CardComponent, FormsModule],
  templateUrl: './etat-stock.component.html',
  styleUrl: './etat-stock.component.scss'
})
export default class EtatStockComponent implements OnInit {
  etatStock: any[] = [];
  nomSearch: string = "";
  selectedArticle: any = null;
  quantiteInserer: any = 0;
  prixUnitaireInserer: any = 0;
  // modalRef!: NgbModalRef;
  

  ngOnInit(): void {
    this.getEtatStock();
  }

  constructor (
    private mouvementStockService: MouvementStockService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  getEtatStock() {

    this.mouvementStockService.getDetailsStock(this.nomSearch).subscribe({
      next: (resp) => {
        this.etatStock = resp.data;
      },
      error: (err) => console.error('erreur lors du chargement de details stock',err)
    });
  }

  open(content: any, article: any) {
    this.selectedArticle = article;
    this.modalService.open(content, {
      centered: true
    });
  }

  inserer() {
    if (this.selectedArticle) {
      const mouvement = {
        id_Article: this.selectedArticle._id,
        type: 0,
        nombre: this.quantiteInserer,
        date: undefined
      }

      this.mouvementStockService.insertMouvementStock(mouvement).subscribe({
        next: (resp) => {
          console.log("insertion succes");
          this.getEtatStock();
        },
        error: (err) => console.error('erreur insertion', err)
      });
    }
  }
}
