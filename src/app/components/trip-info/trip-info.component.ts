import { Component, OnInit, Input } from '@angular/core';
import { Trip } from 'src/app/shared/trip.model';
import { totalTripPrice, totalTripDuration, totalTripDistance } from 'src/app/shared/util/util';

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.scss'],
})
export class TripInfoComponent implements OnInit {
  @Input() trip: Trip;

  constructor() { }

  ngOnInit() {}

  get totalPrice() {
    return totalTripPrice(this.trip);
  }

  get totalDuration(): number {
    return totalTripDuration(this.trip);
  }

  get totalDistance(): number {
    return totalTripDistance(this.trip);
  }

  get priceMessage(): string {
    return this.totalPrice > 0 ? 'Total earnings' : 'Total cost';
  }

  textColor(val: number): string {
    if (val >= 0) {
      return 'success';
    }
    return '';
  }

}
