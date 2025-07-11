import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CadastroComponent } from './cadastro.component';
import { AuthService, AuthRequest } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [CadastroComponent, RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authSpy }]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMsg when fields are missing', () => {
    component.onSubmit('', 'email@example.com', 'pass', 'pass');
    expect(component.errorMsg!).toBe('Preencha todos os campos.');
    component.errorMsg = null;

    component.onSubmit('Name', '', 'pass', 'pass');
    expect(component.errorMsg!).toBe('Preencha todos os campos.');
  });

  it('should set errorMsg when passwords do not match', () => {
    component.onSubmit('Name', 'email@example.com', 'pass1', 'pass2');
    expect(component.errorMsg!).toBe('As senhas não estão compatíveis.');
  });

  it('should register successfully and navigate on success', fakeAsync(() => {
    const msg = 'Cadastro realizado com sucesso';
    authSpy.register.and.returnValue(of(msg));
    spyOn(window, 'alert');
    const navigateSpy = spyOn(router, 'navigate');

    component.onSubmit('Name', 'email@example.com', 'pass', 'pass');
    tick();

    expect(authSpy.register).toHaveBeenCalledWith({ name: 'Name', email: 'email@example.com', password: 'pass' } as AuthRequest);
    expect(window.alert).toHaveBeenCalledWith(msg);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('should set errorMsg on registration error', fakeAsync(() => {
    const errorResponse = { error: 'Erro no servidor' };
    authSpy.register.and.returnValue(throwError(() => errorResponse));

    component.onSubmit('Name', 'email@example.com', 'pass', 'pass');
    tick();

    expect(component.errorMsg!).toBe('Erro no servidor');
  }));
});
