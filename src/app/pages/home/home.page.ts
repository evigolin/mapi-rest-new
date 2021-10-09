import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { ObservableService } from 'src/app/services/observable/observable.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  // any
  user: any;

  // Subscription
  ordersSubscription: Subscription;

  // array
  orders: any[] = [];

  // boolean
  flag: boolean = false;

  // string
  userLang: string;
  orderSelected: any = '';

  // arrays
  listProducts: any = [];
  listProductsTremp: any = [];
  statusOrder: any[] = [
    { name: 'not_read', value: 'not_read', total: 0 },
    { name: 'read', value: 'read', total: 0 },
  ]

  constructor(
    private observableService: ObservableService,
    private apiService: ApiService,
    private utilService: UtilsService,
    public popoverController: PopoverController,
    private translate: TranslateService,

  ) {

    this.flag = true;
    this.observableService._authUSelelected.subscribe(user => {
      if (user || user != null) {
        this.user = user;

        this.ordersSubscription = this.apiService.getOrdersObservable(user.id_firebase).subscribe((orders) => {
          console.log(orders);

          if (orders) {
            this.orders = orders;
          }
        });
      }

      this.flag = false;
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.ordersSubscription) {
        this.ordersSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
  }

  filter() {

    if (this.orderSelected === '') {
      this.listProducts = this.listProductsTremp;

    } else {
      this.flag = true;

      this.listProducts = [];
      for (const list of this.listProductsTremp) {

        if (list.status === this.orderSelected) {
          this.listProducts.push(list);
        }
      }

      this.flag = false;
    }
  }

}
