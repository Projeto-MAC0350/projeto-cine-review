import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/login-response.model';

export interface AuthRequest {
  name:     string;
  email:    string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$  = this.currentUser$.pipe(
    map((u: User | null) => !!u)
  );

  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(request: AuthRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, request, { responseType: 'text' });
  }

  login(request: AuthRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, request)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          const user: User = {
            id: res.id,
            name: res.name,
            email: res.email,
            role: res.role
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
