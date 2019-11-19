import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Observable, combineLatest } from 'rxjs';
import { Trip } from '../shared/trip.model';
import { take, map } from 'rxjs/operators';
import { BookTripRequest } from '../actions/search.actions';
import { LogInFromSearch } from '../actions/auth.actions';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage {
  trip: Observable<Trip>;
  bookTripFetching: Observable<boolean>;
  userLoggedIn: Observable<boolean>;
  showMap = false;

  constructor(private store: Store<State>) {
    this.trip = store
      .select(state => state.search.trip);

    this.bookTripFetching = store
      .select(state => state.search.bookTripFetching);

    this.userLoggedIn = store
      .select(state => state.auth.uid)
      .pipe(map(uid => uid !== ''));
  }

  ionViewDidEnter() {
    this.showMap = true;
  }

  bookTrip() {
    combineLatest([this.userLoggedIn, this.bookTripFetching, this.trip])
      .pipe(take(1))
      .subscribe(([userLoggedIn, fetching, trip]) => {
        if (!fetching && !userLoggedIn) {
          this.store.dispatch(new LogInFromSearch());
        } else if (!fetching) {
          this.store.dispatch(new BookTripRequest(trip));
        }
      });
  }
}
