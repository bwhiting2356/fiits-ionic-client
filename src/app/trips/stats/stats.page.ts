import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
