import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Observable, combineLatest, of } from 'rxjs';
import { Trip } from '../shared/trip.model';
import { take, map } from 'rxjs/operators';
import { BookTripRequest } from '../actions/search.actions';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage {
  trip: Observable<Trip>;
  bookTripFetching: Observable<boolean>;
  showMap = false;

  constructor(private store: Store<State>) {
    this.trip = store
      .select(state => state.search.trip);

    this.bookTripFetching = store
      .select(state => state.search.bookTripFetching);
  }

  ionViewDidEnter() {
    this.showMap = true;
  }

  bookTrip() {
    combineLatest([this.bookTripFetching, this.trip])
      .pipe(take(1))
      .subscribe(([fetching, trip]) => {
        if (!fetching) {
          this.store.dispatch(new BookTripRequest(trip));
        }
      });
  }
}
