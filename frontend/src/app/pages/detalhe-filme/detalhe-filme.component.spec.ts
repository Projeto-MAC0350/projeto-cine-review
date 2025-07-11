import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DetalheFilmeComponent } from './detalhe-filme.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StarRatingModule } from 'angular-star-rating';
import { MovieService } from '../../services/movie.service';
import { ReviewService } from '../../services/review.service';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { User } from '../../models/user.model';
import { Review } from '../../models/review.model';

describe('DetalheFilmeComponent', () => {
  let component: DetalheFilmeComponent;
  let fixture: ComponentFixture<DetalheFilmeComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockMovie: Movie = { id: 1, title: 'Test', imageLink: '', movieInfo: '', director: '', year: '2022', duration: '120min', exhibitionId: 1, noReviews: 2, totalRating: 4 };
  const mockUsers: User[] = [ { id: 1, name: 'Francisco', email: '', role: '' }, { id: 2, name: 'Pedro', email: '', role: '' } ];
  const mockReviews: Review[] = [ { id: 1, movieId: 1, userId: 1, date: '2025-07-10T10:00:00Z', title: 'R1', comment: 'C1', rating: 4 } ];

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MovieService', ['getMovieById']);
    reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['getReviewsByMovieId', 'createReview']);
    userServiceSpy   = jasmine.createSpyObj('UserService',   ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [
        DetalheFilmeComponent,
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        StarRatingModule
      ],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheFilmeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie, users and reviews on init', fakeAsync(() => {
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    movieServiceSpy.getMovieById.and.returnValue(of(mockMovie));
    reviewServiceSpy.getReviewsByMovieId.and.returnValue(of(mockReviews));

    fixture.detectChanges();
    tick();

    expect(component.userMap).toEqual({ 1: 'Francisco', 2: 'Pedro' });
    expect(component.movie).toEqual(mockMovie);
    expect(component.reviews).toEqual(mockReviews);
    expect(component.reviewExpanded).toEqual([false]);
  }));

  it('should set error when movie load fails', fakeAsync(() => {
    userServiceSpy.getUsers.and.returnValue(of([]));
    movieServiceSpy.getMovieById.and.returnValue(throwError(() => new Error('fail')));
    reviewServiceSpy.getReviewsByMovieId.and.returnValue(of([]));

    fixture.detectChanges();
    tick();

    expect(component.error).toBe('Falha buscando o filme ou carregando');
  }));

  it('toggleReadMore toggles reviewExpanded', () => {
    component.reviewExpanded = [false];
    component.toggleReadMore(0);
    expect(component.reviewExpanded[0]).toBeTrue();
    component.toggleReadMore(0);
    expect(component.reviewExpanded[0]).toBeFalse();
  });

  it('openReviewForm sets showForm true', () => {
    component.showForm = false;
    component.openReviewForm();
    expect(component.showForm).toBeTrue();
  });

  it('submitReview calls createReview and hides form on success', fakeAsync(() => {
    component.reviewForm.setValue({ title: 'T', comment: 'C', rating: 3 });
    reviewServiceSpy.createReview.and.returnValue(of(mockReviews[0]));

    component.submitReview();
    tick();

    expect(reviewServiceSpy.createReview).toHaveBeenCalledWith(1, { title: 'T', comment: 'C', rating: 3 });
    expect(component.showForm).toBeFalse();
  }));
});

describe('DetalheFilmeComponent (sem id)', () => {
  let fixture: ComponentFixture<DetalheFilmeComponent>;
  let component: DetalheFilmeComponent;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [
        DetalheFilmeComponent,
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        StarRatingModule
      ],
      providers: [
        { provide: MovieService,    useValue: jasmine.createSpyObj('MovieService', ['getMovieById']) },
        { provide: ReviewService,   useValue: jasmine.createSpyObj('ReviewService', ['getReviewsByMovieId']) },
        { provide: UserService,     useValue: jasmine.createSpyObj('UserService', ['getUsers']) },
        { provide: ActivatedRoute,  useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheFilmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve setar error = "ID ausente"', () => {
    expect(component.error).toBe('ID ausente');
  });
});

