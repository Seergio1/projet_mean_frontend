// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [RouterModule,FormsModule,CommonModule],
  templateUrl: './liste-taches.component.html',
  styleUrls: ['./liste-taches.component.scss']
})
export default class ListeTachesComponent {
  
}
