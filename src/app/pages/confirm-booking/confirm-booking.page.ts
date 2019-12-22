import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { selectTrip } from '../../reducers/search.reducer';
import { TripDetails } from '../../shared/trip-details.model';
import { Observable, combineLatest } from 'rxjs';
import { selectAccountInfoFetching, selectAccountInfo, selectNewUser } from '../../reducers/user.reducer';
import { AccountInfo } from '../../shared/account-info.model';
import { map } from 'rxjs/operators';
import { bookTripRequest } from '../../actions/search.actions';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.page.html',
  styleUrls: ['./confirm-booking.page.scss'],
})
export class ConfirmBookingPage {
  trip: Observable<TripDetails>;
  accountInfoFetching: Observable<boolean>;
  accountInfo: Observable<AccountInfo>;
  canBook: Observable<boolean>;
  newUser: Observable<boolean>;

  constructor(private navCtrl: NavController, private store: Store<State>) {
    this.trip = store.select(selectTrip);
    this.accountInfoFetching = store.select(selectAccountInfoFetching);
    this.accountInfo = store.select(selectAccountInfo);
    this.newUser = store.select(selectNewUser);

    this.canBook = combineLatest([
      this.accountInfo,
      this.trip,
      this.newUser
    ]).pipe(
      map(([accountInfo, trip, newUser]) => {
        const missingData = !(accountInfo && trip);
        if (missingData) {
          return false;
        } else if (newUser) {
          return true;
        }
        return (accountInfo.balance + trip.totalPrice) > 0;
      })
    );
  }

  bookTrip() {
    this.store.dispatch(bookTripRequest());
  }

  backToTripDetails() {
    this.navCtrl.navigateBack('/trip-details');
  }

}
