import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of({ id: 1, name: 'John', email: 'john@example.com', role: 'user' }),
      isLoggedIn$: of(true)
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide links on /login', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/login');
    expect(component.showAuthLinks).toBeFalse();
  });

  it('should hide links on /cadastro', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/cadastro');
    expect(component.showAuthLinks).toBeFalse();
  });


  it('showAuthLinks should be true on other routes', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/filmes');
    expect(component.showAuthLinks).toBeTrue();
  });

  it('logout should call AuthService.logout and navigate to "/"', () => {
    spyOn(router, 'navigate');
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should have currentUser$ and isLoggedIn$ getters from AuthService', () => {
    expect(component.currentUser$).toBe(authServiceSpy.currentUser$);
    expect(component.isLoggedIn$).toBe(authServiceSpy.isLoggedIn$);
  });
});
