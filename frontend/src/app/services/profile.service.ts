import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getProfile(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.api}/perfil`, { headers });
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/users/${id}`);
  }

}
