import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { capitalize } from '../../../shared/util/util';
import { Observable } from 'rxjs';
import { TripDetails } from 'src/app/shared/trip-details.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { selectTrips, selectShowNoTrips, selectTripsFetching, selectFilteredTrips } from 'src/app/reducers/user.reducer';
import { map } from 'rxjs/operators';

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
      console.log(`time direction ${this.timeDirection}`);
      this.trips = store.select(selectFilteredTrips, { direction: this.timeDirection });
      this.showNoTrips = store.select(selectShowNoTrips, { direction: this.timeDirection });
      this.showFetching = store.select(selectTripsFetching);
    }

  get timeDirection(): string {
    return capitalize(this.router.url.split('/').slice(-1)[0]);
  }

}
