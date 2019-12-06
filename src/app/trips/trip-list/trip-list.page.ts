import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { capitalize } from '../../shared/util/util';
import { Observable } from 'rxjs';
import { TripDetails } from 'src/app/shared/trip-details.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { selectTrips, selectShowNoTrips, selectTripsFetching } from 'src/app/reducers/user.reducer';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.page.html',
  styleUrls: ['./trip-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripListPage {
  trips: Observable<TripDetails[]>;
  showFetching: Observable<boolean>;
  showNoTrips: Observable<boolean>;

  constructor(
    private store: Store<State>,
    private router: Router) {
      this.trips = store.select(selectTrips);
      this.showNoTrips = store.select(selectShowNoTrips);
      this.showFetching = store.select(selectTripsFetching);
    }

  get timeDirection(): string {
    return capitalize(this.router.url.split('/').slice(-1)[0]);
  }

}
