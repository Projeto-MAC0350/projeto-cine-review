import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.api}/perfil`);
  }
}
