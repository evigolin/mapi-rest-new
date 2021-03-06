import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
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
    private navCtrl: NavController,
    private alertCtrl: AlertController,

  ) {

    this.flag = true;
    this.observableService._authUSelelected.subscribe(user => {
      if (user || user != null) {
        this.user = user;
      }
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

    this.user = await this.observableService.getUserStorage();

    if (this.user) {
      this.ordersSubscription = this.apiService.getOrdersObservable(this.user.id_firebase).subscribe((orders) => {
        console.log(orders);

        if (orders) {
          this.orders = orders.reverse();
        }
        this.flag = false;
      });
    }

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

  async getDetailProduct(order: any) {

    if (!order.read) {

      this.utilService.presentLoading(this.translate.instant('Processing'));
      await this.apiService.setReadTrue(order).then(async (result) => {
        console.log(result);

        // loading dismiss
        this.utilService.dismissLoading();
        await this.observableService.changeProduct(order);
        this.navCtrl.navigateForward('/detail-order');

      }).catch(async (err) => {
        console.log(err);

        const errorCode = err.code;
        console.log(errorCode);

        // dissmiss loading
        await this.utilService.dismissLoading();

        if (err.status && (err.status === 500 || err.status === 0)) {
          let header = 'Error';
          let message = 'Connection_error';

          // alert
          await this.utilService.alert(header, message);

        } else {
          let header = 'Error';
          let message = 'Apparently_something_is_wrong_try_again';
          await this.alertErrorGetInformationOrder(header, message, order);
        }
      });

    } else {
      await this.observableService.changeProduct(order);
      this.navCtrl.navigateForward('/detail-order');
    }

  }

  async alertErrorGetInformationOrder(header, message, order) {

    const alert = await this.alertCtrl.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            console.log('Confirm Cancel: blah');
            // loading dismiss
            this.utilService.dismissLoading();
          }
        }, {
          text: this.translate.instant('yes'),
          handler: async () => {
            console.log('=============== alert Error get information order ================');
            this.utilService.presentLoading(this.translate.instant('Processing'));
            await this.getDetailProduct(order);
          }
        }
      ]
    });

    await alert.present();
  }
}
