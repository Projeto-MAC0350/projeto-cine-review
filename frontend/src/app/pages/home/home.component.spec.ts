import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule,
        HttpClientTestingModule
        ],
      });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // Mock de dados
    component.diasDaSemana = [
      {
        nome: 'Segunda',
        data: '08/07',
        movies: [
          {
            id: 1,
            title: 'Filme A',
            image: 'poster.jpg',
            day: 'Segunda',
            hour: '20:00',
            theater: 'CINUSP',
          },
        ],
      },
    ];

    component.ultimasReviews = [
      {
        id: 1,
        userId: 55,
        rating: 5,
        date: '2025-07-10T00:00:00Z',
        title: 'Review de Filme A',
        comment: 'Gostei muito!',
        movieId: 1,
      },
    ];

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título principal', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Agora você pode dizer o que viu');
    expect(el.textContent).toContain('e como se sentiu ao sair do CINUSP');
  });

  it('deve exibir o título "Agenda da Semana"', () => {
    const h1 = fixture.debugElement.query(By.css('.agenda-container h1'));
    expect(h1.nativeElement.textContent).toContain('Agenda da Semana');
  });

  it('deve exibir um filme na agenda', () => {
    const movieTitle = fixture.debugElement.query(By.css('.movie-title'));
    expect(movieTitle.nativeElement.textContent).toContain('Filme A');
  });

  it('deve exibir a última review', () => {
    const reviewTitle = fixture.debugElement.query(By.css('.review-card h3'));
    expect(reviewTitle.nativeElement.textContent).toContain('Review de Filme A');
  });
});
