import { Component }      from '@angular/core';
import { RouterOutlet }   from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { StarRatingModule } from 'angular-star-rating';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    StarRatingModule
  ],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
