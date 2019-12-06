import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { TripService } from '../../services/trip.service';
import { capitalize } from '../../shared/util/util';
import { Observable, combineLatest } from 'rxjs';
import { TripDetails } from 'src/app/shared/trip-details.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { selectTrips, selectShowNoTrips, selectTripsFetching } from 'src/app/reducers/user.reducer';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.page.html',
  styleUrls: ['./trip-list.page.scss'],
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
