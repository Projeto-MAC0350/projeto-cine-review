import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { SessionService } from '../../services/session.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // experimentando uma função pra conseguir setar as datas da agenda automaticamente,
  // mas não está usada no html
  title = 'rev.usp';
  diasDaSemana: { nome: string, data: string, movies: { image: string, title: string, day: string, hour: string, theater: string }[] }[] = [];
  movies: Movie[] = [];
  sessions: any[] = []; // Adicione um tipo melhor se tiver um model de Session
  error: string | null = null;

  constructor(
    private movieService: MovieService,
    private sessionService: SessionService
  ) {
    // não chama gerarSemana aqui
  }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        console.log('Movies loaded:', this.movies);
        this.tryGenerateAgenda();
      },
      error: (err) => this.error = 'Erro ao carregar filmes.'
    });

    this.sessionService.getSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        console.log('Sessions loaded:', this.sessions);
        this.tryGenerateAgenda();
      },
      error: (err) => this.error = 'Erro ao carregar sessões.'
    });
  }

  tryGenerateAgenda() {
    if (this.movies.length > 0 && this.sessions.length > 0) {
      this.gerarSemana();
    }
  }

  

  // Função para gerar a agenda baseada em sessions e movies
  getAgenda() {
    // Exemplo: cada session tem movie_id, date (datetime string)
    // cada movie tem id, image
    return this.sessions.map(session => {
      console.log(session);
      const movie = this.movies.find(m => m.id === session.movie_id);
      if (!movie) {
        console.warn('No movie found for session:', session);
        return null;
      }
      const dateObj = new Date(session.date);
      const day = this.formatarData(dateObj);
      const hour = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        image: movie.imageLink, // ajuste se o campo for diferente
        day,
        hour
      };
    }).filter(item => item !== null);
  }

  gerarSemana() {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay();
    const diffSegunda = hoje.getDate() - diaDaSemana + (diaDaSemana == 0 ? -6 : 1);
    const segunda = new Date(hoje.getFullYear(), hoje.getMonth(), diffSegunda);

    const nomeDias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const dias: { nome: string, data: string, movies: { image: string, title: string, day: string, hour: string, theater: string }[] }[] = [];

    for (let i = 0; i < 7; i++) {
      const dia = new Date(segunda);
      dia.setDate(segunda.getDate() + i);
      const dataFormatada = this.formatarData(dia); // now returns dd/MM/yyyy

      // Filtra as sessões para o dia atual
      const moviesDoDia = this.sessions
        .filter(session => {
          // Extrai ano, mês e dia do formato 'YYYY-MM-DDTHH:mm:ss'
          const [datePart] = session.date.split('T');
          const [year, month, day] = datePart.split('-');
          const sessionFormatted = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
          const isMatch = sessionFormatted === dataFormatada;
          return isMatch;
        })
        .map(session => {
          const movie = this.movies.find(m => m.id === session.movieId);
          if (!movie) return null;
          const dateObj = new Date(session.date);
          return {
            image: movie.imageLink ?? '',
            title: movie.title ?? '',
            day: dataFormatada,
            hour: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            theater: this.formatarTheater(session.theater ?? '')
          };
        })
        .filter(item => item !== null);

      console.log(`Dia: ${nomeDias[i]} (${dataFormatada})`, moviesDoDia); //debug

      dias.push({
        nome: nomeDias[i],
        data: dataFormatada,
        movies: moviesDoDia
      });
    }
    this.diasDaSemana = dias;
    console.log('diasDaSemana:', this.diasDaSemana); // debug
  }

  formatarData(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear());
    return `${dia}/${mes}/${ano}`;
  }

  formatarTheater(theater: string): string {
    switch (theater) {
      case 'CINUSP_MARIA_ANTONIA':
        return 'Cinusp Maria Antônia';
      case 'CINUSP_NOVA_SALA':
        return 'Cinusp Nova Sala';
      case 'CINUSP':
        return 'Cinusp';
      default:
        // Torna legível: substitui _ por espaço, capitaliza cada palavra
        return theater
          ? theater
              .toLowerCase()
              .split('_')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
          : '';
    }
  }
}
