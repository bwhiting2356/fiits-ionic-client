import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { TripDetails } from '../shared/trip-details.model';
import { take } from 'rxjs/operators';
import { BookTripRequest } from '../actions/search.actions';
import { LogInFromSearch } from '../actions/user.actions';
import { selectTrip, selectBookTripFetching } from '../reducers/search.reducer';
import { selectUID } from '../reducers/user.reducer';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripDetailsPage {
  trip: Observable<TripDetails>;
  bookTripFetching: Observable<boolean>;
  uid: Observable<string>;
  showMap = new BehaviorSubject(false);

  constructor(private store: Store<State>) {
    this.trip = store.select(selectTrip);
    this.bookTripFetching = store.select(selectBookTripFetching);
    this.uid = store.select(selectUID);
  }

  ionViewDidEnter() {
    this.showMap.next(true);
  }

  bookTrip() {
    // TODO: should this logic be handled by an effect?
    combineLatest([this.uid, this.bookTripFetching, this.trip])
      .pipe(take(1))
      .subscribe(([uid, fetching, trip]) => {
        if (!fetching && uid === '') {
          this.store.dispatch(new LogInFromSearch());
        } else if (!fetching) {
          this.store.dispatch(new BookTripRequest(trip, uid));
        }
      });
  }
}
