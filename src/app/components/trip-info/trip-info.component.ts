import { Component, OnInit, Input } from '@angular/core';
import { Trip } from 'src/app/shared/trip.model';

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.scss'],
})
export class TripInfoComponent implements OnInit {
  @Input() trip: Trip;

  constructor() { }

  ngOnInit() {}

}
