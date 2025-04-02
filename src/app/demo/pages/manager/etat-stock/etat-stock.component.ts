import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  ngOnInit(): void {
    this.getEtatStock();
  }

  constructor (
    private mouvementStockService: MouvementStockService,
    private authService: AuthService
  ) {}

  getEtatStock() {

    this.mouvementStockService.getDetailsStock(this.nomSearch).subscribe({
      next: (resp) => {
        this.etatStock = resp.data;
      },
      error: (err) => console.error('erreur lors du chargement de details stock',err)
    });
  }
}
