import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioComponent } from './usuario.component';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { ReviewService } from '../../services/review.service';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { Review } from '../../models/review.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('UsuarioComponent', () => {
  let component: UsuarioComponent;
  let fixture: ComponentFixture<UsuarioComponent>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;

  const mockUser: User = { id: 1, name: 'User1', email: 'user1@example.com', role: 'user' };
  const mockReviews: Review[] = [
    { id: 1, movieId: 1, userId: 1, date: '2025-07-10T10:00:00Z', title: 'R1', comment: 'C1', rating: 4 }
  ];

  beforeEach(async () => {
    profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getUserById']);
    reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['getReviewsByUser']);

    await TestBed.configureTestingModule({
      imports: [UsuarioComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user and reviews on init', () => {
    profileServiceSpy.getUserById.and.returnValue(of(mockUser));
    reviewServiceSpy.getReviewsByUser.and.returnValue(of(mockReviews));

    fixture.detectChanges();

    expect(component.user).toEqual(mockUser);
    expect(component.reviews).toEqual(mockReviews);
    expect(component.errorUser).toBe('');
    expect(component.errorReviews).toBe('');
  });

  it('should set errorUser when profileService fails', () => {
    profileServiceSpy.getUserById.and.returnValue(throwError(() => new Error()));
    reviewServiceSpy.getReviewsByUser.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.errorUser).toBe('Usuario nao encontrado');
  });

  it('should set errorReviews when reviewService fails', () => {
    profileServiceSpy.getUserById.and.returnValue(of(mockUser));
    reviewServiceSpy.getReviewsByUser.and.returnValue(throwError(() => new Error()));

    fixture.detectChanges();

    expect(component.errorReviews).toBe('Nao ha reviews');
  });
});
