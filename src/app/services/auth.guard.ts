import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { selectLoggedIn } from '../reducers/user.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<State>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectLoggedIn)
        .pipe(
          tap(loggedIn => {
            if (!loggedIn) { this.router.navigate(['/sign-in']); }
          })
        );
  }
}
