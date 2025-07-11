import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue('test-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch profile with authorization header', () => {
    const dummyUser: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    };

    service.getProfile().subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/perfil`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(dummyUser);
  });

  it('should fetch user by ID without authorization header', () => {
    const userId = 42;
    const dummyUser: User = {
      id: userId,
      name: 'Other User',
      email: 'other@example.com',
      role: 'admin'
    };

    service.getUserById(userId).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush(dummyUser);
  });
});
