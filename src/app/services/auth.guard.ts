import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
      return this.userService.isLoggedIn$()
        .pipe(
          tap(loggedIn => {
            if (!loggedIn) { this.router.navigate(['/sign-in']); }
          })
        );
  }
}
