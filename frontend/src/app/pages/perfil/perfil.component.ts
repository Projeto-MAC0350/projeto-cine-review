import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { ReviewService } from '../../services/review.service';
import { User } from '../../models/user.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  user: User | null = null;
  reviews: Review[] = [];
  errorUser = '';
  errorReviews = '';

  constructor(
    private profileService: ProfileService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(
      {
        next: p => this.user = p,
        error: () => this.errorUser = 'Erro pra obter o perfil'
      }
    );
    this.reviewService.getMyReviews().subscribe({
      next: rv => this.reviews = rv,
      error: () => this.errorReviews = 'Voce nao tem reviews'
    });
  }
}
