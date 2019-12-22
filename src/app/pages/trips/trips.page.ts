import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { capitalize } from '../../shared/util/util';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripsPage implements OnInit {

  constructor(
    private router: Router) { }

  ngOnInit() {
  }

  get timeDirectionCapitalized(): string {
    return capitalize(this.router.url.split('/').slice(-1)[0]);
  }

}
