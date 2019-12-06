import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { TripService } from '../../services/trip.service';
import { capitalize } from '../../shared/util/util';
import { Observable } from 'rxjs';
import { TripDetails } from 'src/app/shared/trip-details.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { selectTrips } from 'src/app/reducers/user.reducer';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.page.html',
  styleUrls: ['./trip-list.page.scss'],
})
export class TripListPage {
  trips: Observable<TripDetails[]>;

  constructor(
    private store: Store<State>,
    private router: Router) {
      this.trips = store.select(selectTrips);
    }

  get timeDirection(): string {
    return capitalize(this.router.url.split('/').slice(-1)[0]);
  }

}
