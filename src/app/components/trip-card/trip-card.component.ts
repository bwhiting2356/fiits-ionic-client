import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TripDetails } from 'src/app/shared/trip-details.model';
import { totalTripPrice, totalTripDuration, totalTripDistance, addSeconds } from 'src/app/shared/util/util';

export const RESERVATION_WINDOW = 10 * 60; // ten miutes

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

  isUpcoming(): boolean {
    const currentTime = new Date();
    const arrivalTime = new Date(this.trip.arrivalTime);
    return currentTime < arrivalTime;
  }

  isReadyForScan(): boolean {
    const start = new Date(this.trip.startReservation.time);
    const end = addSeconds(start, RESERVATION_WINDOW);
    const currentTime = new Date();
    return currentTime >= start && currentTime <= end;
  }
}
