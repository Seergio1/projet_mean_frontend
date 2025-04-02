import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { BreadcrumbComponent } from "../../../../theme/shared/components/breadcrumbs/breadcrumbs.component";
import { CommentairesService } from 'src/app/services/commentaires.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-commentaires',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, CardComponent, BreadcrumbComponent],
  templateUrl: './commentaires.component.html',
  styleUrl: './commentaires.component.scss'
})
export default class CommentairesComponent implements OnInit {
  commentaires: any[] = [];
  commentaire = {
    id_utilisateur: '',
    libelle: '',
    date: ''
  };

  constructor(private commentairesService: CommentairesService, private authService: AuthService) {}

  async ngOnInit() {
    // throw new Error("afafa");

    this.loadCommentaires();
  }

  loadCommentaires(): void {
    this.commentairesService.getAllCommentaires().subscribe( data => {
      this.commentaires = Array.isArray(data.data) ? data.data : [];
      console.log(this.commentaires);
    });
  }

  insertCommentaire() {
    const userInfo = this.authService.getUserInfo();
    this.commentaire.id_utilisateur = userInfo.id;
    this.commentairesService.insertCommentaires(this.commentaire).subscribe({
      next: (response) => {
        this.loadCommentaires();
      },
      error: (err) => {
        console.log(err.error.message);
      }
    });
    // console.log(this.commentaire);
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
