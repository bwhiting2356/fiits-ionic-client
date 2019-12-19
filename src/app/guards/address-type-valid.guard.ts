import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { selectAddressType } from '../reducers/search.reducer';

@Injectable({
  providedIn: 'root'
})
export class AddressTypeValidGuard implements CanActivate {
  constructor(private store: Store<State>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectAddressType)
        .pipe(
            map(addressType => !!addressType),
            tap(addressType => {
                if (!addressType) { this.router.navigate(['/search']); }
            })
        );
  }
}
