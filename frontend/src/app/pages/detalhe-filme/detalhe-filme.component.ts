import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { ReviewService } from '../../services/review.service'
import { UserService } from '../../services/user.service'
import { StarRatingModule } from 'angular-star-rating';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-detalhe-filme',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StarRatingModule],
  templateUrl: './detalhe-filme.component.html',
  styleUrls: ['./detalhe-filme.component.css' ]
})
export class DetalheFilmeComponent implements OnInit {
  reviewForm!: FormGroup;
  userMap: { [id: number]: string } = {};
  showForm = false;
  movie: Movie | null = null;
  error: string | null = null;
  reviews: any[] = [];
  reviewExpanded: boolean[] = [];

  toggleReadMore(i: number): void {
    this.reviewExpanded[i] = !this.reviewExpanded[i];
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private reviewService: ReviewService,
    private userService: UserService
  ) {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      comment: ['', Validators.required],
      rating: [2.5, [Validators.required, Validators.min(0), Validators.max(5)]],
      });
    }

  openReviewForm() {
      this.showForm = true;
    }

  submitReview() {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.reviewForm.valid) {
      this.reviewService
        .createReview(movieId, this.reviewForm.value)
        .subscribe({
          next: review => {
            this.showForm = false;
          },
          error: err => console.error(err)
        });
    }
  }


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;

      this.userService.getUsers().subscribe(users => {
        this.userMap = Object.fromEntries(users.map(u => [u.id, u.name]));
      });

      this.movieService.getMovieById(id).subscribe({
        next: (filmeRecebido) => {
          this.movie = filmeRecebido;
        },
        error: (err) => {
          console.error('Erro para encontrar o filme:', err);
          this.error = 'Falha buscando o filme ou carregando';
        }
      });

      this.reviewService.getReviewsByMovieId(id).subscribe({
        next: (reviewsRecebidas) => {
          this.reviews = reviewsRecebidas;
          this.reviewExpanded = reviewsRecebidas.map(() => false);
        },
        error: (err) => {
          console.error('Filme não possui reviews', err);
        }
      });
    }

    else {
      this.error = 'ID ausente';
      console.error(this.error);
    }

  }

}
