import { TestBed } from '@angular/core/testing';
import { MovieService } from './movie.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Movie } from '../models/movie.model';
import { environment } from '../environments/environment';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar todos os filmes com getMovies()', () => {
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: 'Matrix',
        duration: '2h 16min',
        imageLink: 'matrix.jpg',
        exhibitionId: 1,
        noReviews: 1,
        totalRating: 1
      },
      {
        id: 2,
        title: 'O Senhor dos Anéis',
        duration: '3h 48min',
        imageLink: 'lotr.jpg',
        exhibitionId: 2,
        noReviews: 2,
        totalRating: 2
      }
    ];

    service.getMovies().subscribe((movies) => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/movies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

  it('deve buscar um filme por ID com getMovieById()', () => {
    const mockMovie: Movie = {
      id: 1,
      title: 'Matrix',
      duration: '2h 16min',
      imageLink: 'matrix.jpg',
      exhibitionId: 1,
      noReviews: 1,
      totalRating: 1
    };

    service.getMovieById(1).subscribe((movie) => {
      expect(movie).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/movies/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
  });
});
