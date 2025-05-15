import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentairesService } from 'src/app/services/commentaires.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-avis',
  imports: [CommonModule],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.scss',
  standalone: true
})
export default class AvisComponent implements OnInit{
  commentaires: any[] = [];
  commentaire = {
    id_utilisateur: '',
    libelle: '',
    date: ''
  };
  ngOnInit(): void {
    this.loadCommentaires();
  }
  constructor(private commentairesService: CommentairesService, private authService: AuthService) {}

  loadCommentaires(): void {
    // const userInfo = this.authService.getUserInfo();
    this.commentairesService.getAllCommentaires().subscribe( data => {
      this.commentaires = Array.isArray(data.data) ? data.data : [];
      console.log(this.commentaires);
    });
  }

  modifierDate(date: string): string {
    const date1 = new Date(date);
    const datePart = date1.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  
    const timePart = date1.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  
    return `${datePart} à ${timePart}`;
  }
  

}
