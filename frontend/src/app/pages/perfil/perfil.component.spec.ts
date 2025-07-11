import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PerfilComponent } from './perfil.component';
import { ProfileService } from '../../services/profile.service';
import { ReviewService } from '../../services/review.service';
import { User } from '../../models/user.model';
import { Review } from '../../models/review.model';
import { of, throwError } from 'rxjs';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };
  const mockReviews: Review[] = [
    { id: 1, movieId: 1, userId: 1, date: '2025-07-10T10:00:00Z', title: 'R1', comment: 'C1', rating: 4 }
  ];

  beforeEach(async () => {
    profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getProfile']);
    reviewServiceSpy  = jasmine.createSpyObj('ReviewService', ['getMyReviews']);

    await TestBed.configureTestingModule({
      imports: [PerfilComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: ReviewService,  useValue: reviewServiceSpy  }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user and reviews on init', () => {
    profileServiceSpy.getProfile.and.returnValue(of(mockUser));
    reviewServiceSpy.getMyReviews.and.returnValue(of(mockReviews));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.user).toEqual(mockUser);
    expect(component.reviews).toEqual(mockReviews);
    expect(component.errorUser).toBe('');
    expect(component.errorReviews).toBe('');
  });

  it('should set errorUser when profileService fails', () => {
    profileServiceSpy.getProfile.and.returnValue(throwError(() => new Error('fail')));
    reviewServiceSpy.getMyReviews.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.errorUser).toBe('Erro pra obter o perfil');
  });

  it('should set errorReviews when reviewService fails', () => {
    profileServiceSpy.getProfile.and.returnValue(of(mockUser));
    reviewServiceSpy.getMyReviews.and.returnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(component.errorReviews).toBe('Voce nao tem reviews');
  });
});
