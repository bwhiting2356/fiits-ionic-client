import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
