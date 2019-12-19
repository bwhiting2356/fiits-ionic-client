import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { selectTrip } from '../reducers/search.reducer';

@Injectable({
  providedIn: 'root'
})
export class TripValidGuard implements CanActivate {
  constructor(private store: Store<State>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectTrip)
        .pipe(
            map(trip => !!trip),
            tap(trip => {
                if (!trip) { this.router.navigate(['/search']); }
            })
        );
  }
}
