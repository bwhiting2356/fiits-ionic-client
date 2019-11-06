import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Observable } from 'rxjs';
import { Trip } from '../shared/trip.model';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage {
  trip: Observable<Trip>;
  showMap = false;

  constructor(private store: Store<State>) {
    this.trip = store
      .select(state => state.search.trip);
  }

  ionViewDidEnter() {
    this.showMap = true;
  }

}
