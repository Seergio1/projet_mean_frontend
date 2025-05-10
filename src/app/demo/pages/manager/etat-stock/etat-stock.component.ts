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
  quantiteInserer: any = 1;
  prixUnitaireInserer: any = 0;
  userInfo: any = null
  // modalRef!: NgbModalRef;

  etatFilter: string | null = null;
  filterStock: any[] = [];
  

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.getEtatStock();
  }

  constructor (
    private mouvementStockService: MouvementStockService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  getEtatStock() {

    this.mouvementStockService.getDetailsStock(this.nomSearch,this.userInfo.role).subscribe({
      next: (resp) => {
        this.etatStock = resp.data;
        console.log(resp.data);
        
        this.applyFilters();
      },
      error: (err) => console.error('erreur lors du chargement de details stock',err)
    });
  }

  getMouvementStockByArticle(id_Article: string) {
    this.mouvementStockService.getMouvementStockByArticle(id_Article, this.userInfo.role).subscribe({
      next: (resp) => {
        console.log(resp.data);
      },
      error: (err) => console.error('erreur lors du chargement de mouvement de stocks', err)
    });
  }

  applyFilters() {
    this.filterStock = this.etatStock.filter((stock) => {
      const reste = stock.totalEntrer - stock.totalSortie;
      if (this.etatFilter === 'Normal') {
        return reste > stock.seuil;
      } else if (this.etatFilter === 'Faible') {
        return reste < stock.seuil;
      } else if (this.etatFilter === "") { 
        return true; 
      }
      return true
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
