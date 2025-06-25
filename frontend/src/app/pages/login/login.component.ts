import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthRequest, AuthService} from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  errorMsg: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(email: string, password: string){
    if(!email || !password){
      this.errorMsg = "Preencha email e senha!";
      return;
    }
    const payload: AuthRequest = { name: '', email, password };
    this.auth.login(payload).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: err => {
        this.errorMsg = err.error.message;
      }
    });
  }
}
