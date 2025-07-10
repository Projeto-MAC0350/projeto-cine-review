import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalheFilmeComponent } from './detalhe-filme.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie }        from '../../models/movie.model';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule }     from '@angular/router/testing';

describe('DetalheFilmeComponent', () => {
  let component: DetalheFilmeComponent;
  let fixture: ComponentFixture<DetalheFilmeComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  const mockMovie: Movie = {
    id: 1,
    title: 'Filme de Teste',
    director: 'Diretor X',
    year: '2020',
    exhibitionId: 1,
    noReviews: 1,
    totalRating: 1,
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MovieService', ['getMovieById']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ DetalheFilmeComponent ],
      providers: [
        { provide: MovieService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'  // simula /movies/1
              }
            }
          }
        }
      ]
    })
      .compileComponents();

    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    movieServiceSpy.getMovieById.and.returnValue(of(mockMovie));

    fixture = TestBed.createComponent(DetalheFilmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar getMovieById com id 1', () => {
    expect(movieServiceSpy.getMovieById).toHaveBeenCalledWith(1);
  });

  it('deve popular a propriedade movie do componente', () => {
    expect(component.movie).toEqual(mockMovie);
  });
});
