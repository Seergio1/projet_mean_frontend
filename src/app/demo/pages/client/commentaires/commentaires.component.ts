import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { BreadcrumbComponent } from "../../../../theme/shared/components/breadcrumbs/breadcrumbs.component";
import { CommentairesService } from 'src/app/services/commentaires.service';

@Component({
  selector: 'app-commentaires',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, CardComponent, BreadcrumbComponent],
  templateUrl: './commentaires.component.html',
  styleUrl: './commentaires.component.scss'
})
export default class CommentairesComponent implements OnInit {
  commentaires: any[] = [];

  constructor(private commentairesService: CommentairesService) {}

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

  insertCommentaire(commentaire:): void {

  }

}
