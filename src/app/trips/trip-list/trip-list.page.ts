import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { TripService } from '../../services/trip.service';
import { capitalize } from '../../shared/util/util';
import { Observable } from 'rxjs';
import { Trip } from 'src/app/shared/trip.model';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.page.html',
  styleUrls: ['./trip-list.page.scss'],
})
export class TripListPage implements OnInit {
  trips: Observable<Trip[]>;

  constructor(private router: Router, public tripService: TripService) {}

  ngOnInit() {
    this.trips = this.tripService.getFilteredTrips(this.timeDirection, new Date());
  }

  get timeDirection(): string {
    return capitalize(this.router.url.split('/').slice(-1)[0]);
  }

}
