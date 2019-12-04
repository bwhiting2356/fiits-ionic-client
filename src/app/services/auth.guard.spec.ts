import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { mock } from 'ts-mockito';

describe('AuthGuard', () => {

  it('should return an observable of true', async () => {
    const mockAuthService = { isLoggedIn$: () => of(true) } as AuthService;
    const mockRouter = mock<Router>();
    spyOn(mockRouter, 'navigate');
    const guard: AuthGuard = new AuthGuard(mockAuthService, mockRouter);
    guard.canActivate().subscribe(result => expect(result).toBeTruthy());
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should return an observable of false', async () => {
    const mockAuthService = { isLoggedIn$: () => of(false) } as AuthService;
    const mockRouter = mock<Router>();
    spyOn(mockRouter, 'navigate');
    const guard: AuthGuard = new AuthGuard(mockAuthService, mockRouter);
    guard.canActivate().subscribe(result => expect(result).toBeFalsy());
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sign-in']);
  });
});
