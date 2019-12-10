import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TripDetails } from 'src/app/shared/trip-details.model';

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripInfoComponent implements OnInit {
  @Input() trip: TripDetails;

  constructor() { }

  ngOnInit() {}

  get priceMessage(): string {
    return this.trip.totalPrice > 0 ? 'Total earnings' : 'Total cost';
  }

  textColor(val: number): string {
    if (val >= 0) {
      return 'success';
    }
    return '';
  }

}
