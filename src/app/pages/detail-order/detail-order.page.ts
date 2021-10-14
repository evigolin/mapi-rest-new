import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ObservableService } from 'src/app/services/observable/observable.service';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.page.html',
  styleUrls: ['./detail-order.page.scss'],
})
export class DetailOrderPage implements OnInit {
  // any
  order: any;

  // Subscription
  detailSuscription: Subscription;

  // boolean
  flag: boolean;

  constructor(
    private observableService: ObservableService,

  ) {

    this.flag = true;

    this.detailSuscription = this.observableService._detailSelelected.subscribe(order => {

      if (order) {
        this.order = order;
      }

      this.flag = false;
    });
  }

  ngOnInit() {

  }

}
