import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { User } from '../../models/user.model';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})

export class UsuarioComponent implements OnInit {
  user!: User;
  reviews: Review[] = [];
  errorUser = '';
  errorReviews = '';

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.profileService.getUserById(id).subscribe({
      next: u => this.user = u,
      error: () => this.errorUser = 'Usuario nao encontrado'
      }
    );
    this.reviewService.getReviewsByUser(id).subscribe({
      next: rs => this.reviews = rs,
      error: () => this.errorReviews = 'Nao ha reviews'
    });
  }
}
