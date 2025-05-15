import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { MouvementStockService } from 'src/app/services/manager/mouvement-stock.service';

@Component({
  selector: 'app-etat-stock',
  imports: [CommonModule, FormsModule],
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

  detailArtcle: any = null;
  

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
        
        this.applyFilters();
      },
      error: (err) => console.error('erreur lors du chargement de details stock',err)
    });
  }

  getMouvementStockByArticle(id_Article: string) {
    this.mouvementStockService.getMouvementStockByArticle(id_Article, this.userInfo.role).subscribe({
      next: (resp) => {
        this.detailArtcle = resp.data;
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
  
  open(content: any, article: any,detail: any) {
    this.selectedArticle = article;
    if (detail) {
      this.getMouvementStockByArticle(this.selectedArticle._id);
    }
    this.modalService.open(content, {
      centered: true
    });
  }
modifierDate(date: string | Date) {
  const dateObj = new Date(date);

  const formattedDate = dateObj.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const formattedTime = dateObj.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return {
    date: formattedDate,
    heure: formattedTime
  };
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
