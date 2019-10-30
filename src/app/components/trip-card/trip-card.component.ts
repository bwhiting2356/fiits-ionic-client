import { Component, OnInit, Input } from '@angular/core';
import { Trip } from 'src/app/shared/trip.model';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss'],
})
export class TripCardComponent implements OnInit {
  @Input() trip: Trip;

  constructor() { }

  ngOnInit() {}

  get totalPrice(): number {
    return this.trip.startReservation.price
            + this.trip.endReservation.price
            + this.trip.rentalPrice;
  }

  get totalDuration(): number {
    return this.trip.bicyclingDirections.seconds
            + this.trip.walking1Directions.seconds
            + this.trip.walking2Directions.seconds;
  }

  get totalDistance(): number {
    return this.trip.walking2Directions.feet
            + this.trip.walking1Directions.feet
            + this.trip.bicyclingDirections.feet;
  }
}
