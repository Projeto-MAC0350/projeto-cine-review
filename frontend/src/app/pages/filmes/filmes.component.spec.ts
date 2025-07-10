import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmesComponent } from './filmes.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('FilmesComponent', () => {
  let component: FilmesComponent;
  let fixture: ComponentFixture<FilmesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilmesComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilmesComponent);
    component = fixture.componentInstance;

    // Mock:
    component.movies = [
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

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título "Filmes"', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Filmes');
  });

  it('deve renderizar todos os filmes', () => {
    const movieCards = fixture.debugElement.queryAll(By.css('.movie-card'));
    expect(movieCards.length).toBe(2);

    const firstTitle = movieCards[0].nativeElement.querySelector('h2')?.textContent;
    expect(firstTitle).toContain('Matrix');
  });

  it('deve mostrar mensagem de erro se "error" estiver definido', () => {
    component.error = 'Erro ao carregar filmes';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.error')?.textContent).toContain('Erro ao carregar filmes');
  });
});
