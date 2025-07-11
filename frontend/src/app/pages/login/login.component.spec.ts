import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService, AuthRequest } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authSpy }]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMsg when email or password is missing', () => {
    component.onSubmit('', '');
    expect(component.errorMsg).toBe('Preencha email e senha!');
  });

  it('should call auth.login and navigate on successful login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const credentials: AuthRequest = { name: '', email: 'user@example.com', password: 'password' };
    const loginResponse = { id: 1, name: 'User', email: 'user@example.com', role: 'user', token: 'token' };

    authSpy.login.and.returnValue(of(loginResponse));
    component.onSubmit(credentials.email, credentials.password);

    expect(authSpy.login).toHaveBeenCalledWith(credentials);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should set errorMsg on failed login', () => {
    const error = { error: { message: 'Invalid credentials' } };
    authSpy.login.and.returnValue(throwError(() => error));

    component.onSubmit('user@example.com', 'wrongpass');
    expect(component.errorMsg).toBe('Invalid credentials');
  });
});
