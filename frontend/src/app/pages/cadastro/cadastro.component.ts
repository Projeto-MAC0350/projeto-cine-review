import { Component } from '@angular/core';
import { AuthService, AuthRequest } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  errorMsg: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {

    if (!name || !email || !password || !confirmPassword) {
      this.errorMsg = 'Preencha todos os campos.';
      return;
    }
    if (password !== confirmPassword) {
      this.errorMsg = 'As senhas não estão compatíveis.';
      return;
    }

    const payload: AuthRequest = { name, email, password };
    this.auth.register(payload).subscribe({
      next: msg => {
        alert(msg);
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMsg = err.error || 'Erro ao cadastrar usuário.';
      }
    });
  }
}
