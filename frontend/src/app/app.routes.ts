import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { FilmesComponent } from './pages/filmes/filmes.component';
import {DetalheFilmeComponent} from './pages/detalhe-filme/detalhe-filme.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'filmes', component: FilmesComponent},
  { path: 'filmes/:id', component: DetalheFilmeComponent},
  { path: 'perfil', component: PerfilComponent },
  { path: 'users/:id', loadComponent: () => import('./pages/usuario/usuario.component').then(m => m.UsuarioComponent) }
];
