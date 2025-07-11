import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthRequest } from './auth.service';
import { environment } from '../environments/environment';
import { LoginResponse } from '../models/login-response.model';
import { User } from '../models/user.model';
import { take } from 'rxjs/operators';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user and return message', () => {
    const request: AuthRequest = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const responseMessage = 'Registration successful';

    service.register(request).subscribe(message => {
      expect(message).toBe(responseMessage);
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(responseMessage);
  });

  it('should login and store token and currentUser', () => {
    const request: AuthRequest = { name: 'Login', email: 'login@example.com', password: 'pwd' };
    const loginResponse: LoginResponse = { id: 1, name: 'Login', email: 'login@example.com', role: 'user', token: 'abc123' };

    service.login(request).subscribe(res => {
      expect(res).toEqual(loginResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(loginResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', loginResponse.token);
    const expectedUser: User = {
      id: loginResponse.id,
      name: loginResponse.name,
      email: loginResponse.email,
      role: loginResponse.role
    };
    expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(expectedUser));

    service.currentUser$.pipe(take(1)).subscribe(user => {
      expect(user).toEqual(expectedUser);
    });
  });

  it('should logout and clear currentUser', () => {
    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    service.currentUser$.pipe(take(1)).subscribe(user => {
      expect(user).toBeNull();
    });
  });

  it('should reflect isLoggedIn$ correctly', () => {
    // Initially not logged in
    service.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
    });

    // After login
    const loginResponse: LoginResponse = { id: 2, name: 'User2', email: 'u2@example.com', role: 'admin', token: 'token2' };
    service.login({ name: '', email: '', password: '' }).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/login`);
    req.flush(loginResponse);

    service.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });
  });
});
