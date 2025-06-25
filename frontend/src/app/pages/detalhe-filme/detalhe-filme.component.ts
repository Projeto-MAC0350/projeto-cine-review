import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-detalhe-filme',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhe-filme.component.html',
  styleUrl: './detalhe-filme.component.css'
})
export class DetalheFilmeComponent implements OnInit {
  movie: Movie | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;

      this.movieService.getMovieById(id).subscribe({
        next: (filmeRecebido) => {
          this.movie = filmeRecebido;
        },
        error: (err) => {
          console.error('Erro para encontrar o filme:', err);
          this.error = 'Falha buscando o filme ou carregando';
        }
      });
    }
    else {
      this.error = 'ID ausente';
      console.error(this.error);
    }

  }

}
