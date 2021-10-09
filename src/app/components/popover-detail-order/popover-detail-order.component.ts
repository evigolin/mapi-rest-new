import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-detail-order',
  templateUrl: './popover-detail-order.component.html',
  styleUrls: ['./popover-detail-order.component.scss'],
})
export class PopoverDetailOrderComponent implements OnInit {
  @Input() order;

  constructor(
    private popoverController: PopoverController,
     ) { }

  ngOnInit() {
    console.log(this.order);
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }

}
