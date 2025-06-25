import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MovieService} from '../../services/movie.service';
import { Movie} from '../../models/movie.model';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-filmes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.css']
})
export class FilmesComponent implements OnInit {
  movies: Movie[] = [];
  error: string | null = null;

  constructor(private svc : MovieService) {

  }

  ngOnInit(): void {
    this.svc.getMovies().subscribe({
      next: ms => this.movies = ms,
      error: () => this.error = "Erro ao carregar filmes"
    });
  }
}
