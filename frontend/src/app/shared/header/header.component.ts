import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService }  from '../../services/auth.service';
import { filter }      from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUrl: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentUrl = e.urlAfterRedirects;
      });
  }

  get currentUser$() {
    return this.auth.currentUser$;
  }

  get isLoggedIn$() {
    return this.auth.isLoggedIn$;
  }

  get showAuthLinks(): boolean {
    const path = this.router.url.split('?')[0];
    return path !== '/login' && path !== '/cadastro';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
