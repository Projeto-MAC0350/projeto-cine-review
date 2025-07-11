import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { environment } from '../environments/environment';
import { Review } from '../models/review.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(localStorage, 'getItem').and.returnValue('test-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch my reviews with authorization header', () => {
    const dummyReviews: Review[] = [
      { id: 1, movieId: 1, userId: 1, date: '2025-07-10T10:00:00Z', title: 'Great movie', comment: 'Loved it', rating: 5 },
      { id: 2, movieId: 2, userId: 1, date: '2025-07-11T11:00:00Z', title: 'Not bad', comment: 'Enjoyed', rating: 4 },
    ];

    service.getMyReviews().subscribe(reviews => {
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne(`${apiUrl}/perfil/reviews`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(dummyReviews);
  });

  it('should fetch reviews by user ID', () => {
    const userId = 3;
    const dummyReviews: Review[] = [
      { id: 3, movieId: 1, userId: userId, date: '2025-07-09T09:00:00Z', title: 'User Review', comment: 'Good', rating: 3 },
    ];

    service.getReviewsByUser(userId).subscribe(reviews => {
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}/reviews`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReviews);
  });

  it('should fetch reviews by movie ID', () => {
    const movieId = 5;
    const dummyReviews: Review[] = [
      { id: 4, movieId: movieId, userId: 4, date: '2025-07-08T08:00:00Z', title: 'Movie Review', comment: 'Awesome', rating: 5 },
    ];

    service.getReviewsByMovieId(movieId).subscribe(reviews => {
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne(`${apiUrl}/movies/${movieId}/reviews`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReviews);
  });

  it('should fetch latest reviews', () => {
    const dummyReviews: Review[] = [
      { id: 10, movieId: 7, userId: 5, date: '2025-07-11T13:00:00Z', title: 'Latest', comment: 'Just posted', rating: 4 },
    ];

    service.getUltimasReviews().subscribe(reviews => {
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne(`${apiUrl}/reviews/ultimas`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReviews);
  });

  it('should create a review with authorization header', () => {
    const movieId = 8;
    const payload = { title: 'New', comment: 'Excellent', rating: 5, userId: 1, date: '2025-07-11T14:00:00Z' };
    const dummyReview: Review = { id: 20, movieId: movieId, userId: 1, date: '2025-07-11T14:00:00Z', title: 'New', comment: 'Excellent', rating: 5 };

    service.createReview(movieId, payload).subscribe(review => {
      expect(review).toEqual(dummyReview);
    });

    const req = httpMock.expectOne(`${apiUrl}/movies/${movieId}/reviews`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(dummyReview);
  });
});
