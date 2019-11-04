import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Observable, of } from 'rxjs';
import { Trip } from '../shared/trip.model';
import { mockTrips } from '../trips/mock-trips';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage implements OnInit {
  trip: Observable<Trip>;

  constructor(private store: Store<State>) { 
    this.trip = store
      .select(state => state.search.trip);
    // this.trip = of(mockTrips[0])
  }

  ngOnInit() { }

}
