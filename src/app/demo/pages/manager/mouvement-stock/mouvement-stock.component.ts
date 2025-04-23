import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MouvementStockService } from 'src/app/services/manager/mouvement-stock.service';
import { CardComponent } from "../../../../theme/shared/components/card/card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mouvement-stock',
  imports: [FormsModule, CardComponent, CommonModule],
  templateUrl: './mouvement-stock.component.html',
  styleUrl: './mouvement-stock.component.scss',
  standalone: true
})
export default class MouvementStockComponent implements OnInit {
  mouvements: any[] = [];
  colonnes: any[] = [
    { id: '', label: 'label' },
    { id: 'entrer', label: 'Company Name' },
    { id: 'sortie', label: 'Product Name' },
    { id: 'date', label: 'Extremely long Product Description' },
    { id: 'prix', label: 'Status' },
    { id: 'prix_total', label: 'Price ($)' }
  ];


  ngOnInit(): void {
    
    this.getMouvementStock();
  }

  constructor (
    private mouvementStockService: MouvementStockService,
    private authService: AuthService
  ) {}

  getMouvementStock() {
    this.mouvementStockService.getMouvementStock().subscribe({
      next: (resp) => {
        console.log(resp.data);
        this.mouvements = resp.data;
      },
      error: (err) => console.error('erreur lors du chargement de mouvement de stocks', err)
    });
  }

  modifierDate(date) {
    const date1 = new Date(date);
    const reponse = date1.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    return reponse;
  }
}
