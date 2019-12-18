import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { Observable, BehaviorSubject } from 'rxjs';
import { TripDetails } from '../../shared/trip-details.model';
import { take } from 'rxjs/operators';

import { selectTrip } from '../../reducers/search.reducer';
import { selectLoggedIn } from '../../reducers/user.reducer';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripDetailsPage {
  trip: Observable<TripDetails>;
  showMap = new BehaviorSubject(false);

  constructor(private navCtrl: NavController, private store: Store<State>) {
    this.trip = store.select(selectTrip);
  }

  ionViewDidEnter() {
    this.showMap.next(true);
  }

  confirmBooking() {
    this.store.select(selectLoggedIn)
      .pipe(take(1))
      .subscribe(loggedIn => {
        if (loggedIn) {
          this.navCtrl.navigateForward('/confirm-booking');
        } else {
          this.navCtrl.navigateForward('/sign-in/from-search');
        }
      });
  }
}
