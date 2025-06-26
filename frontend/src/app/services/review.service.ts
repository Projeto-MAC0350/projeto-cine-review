import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private api = environment.apiUrl;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyReviews(): Observable<Review[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Review[]>(`${this.apiUrl}/perfil/reviews`, { headers } );
  }

  getReviewsByUser(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/users/${userId}/reviews`);
  }

  createReview(movieId: number, payload: {
    title: string;
    comment: string;
    rating: number;
  }): Observable<Review> {
    const token = localStorage.getItem('token')!;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Review>(
      `${this.api}/movies/${movieId}/reviews`,
      payload,
      { headers }
    );
  }

}
