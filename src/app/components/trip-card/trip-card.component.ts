import { Component, OnInit, Input } from '@angular/core';
import { TripDetails } from 'src/app/shared/trip-details.model';
import { totalTripPrice, totalTripDuration, totalTripDistance } from 'src/app/shared/util/util';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss'],
})
export class TripCardComponent implements OnInit {
  @Input() trip: TripDetails;

  constructor() { }

  ngOnInit() {}

  get totalPrice(): number {
    return totalTripPrice(this.trip);
  }

  get totalDuration(): number {
    return totalTripDuration(this.trip);
  }

  get totalDistance(): number {
    return totalTripDistance(this.trip);
  }
}
