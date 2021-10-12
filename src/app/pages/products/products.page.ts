import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ObservableService } from 'src/app/services/observable/observable.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  // number
  id: Number;

  // any
  categoryList: any;
  title: any;
  loading: any;
  img: any;
  description: any;
  user: any;
  schedule: any;

  // boolean
  flag: boolean = false;

  constructor(
    private apiService: ApiService,
    private observableService: ObservableService,
    public utilService: UtilsService,
    private translate: TranslateService,

  ) {

  }

  async ngOnInit() {

    this.flag = true;
    this.user = await this.observableService.getUserStorage();
    this.id = Number(this.user.id);
    this.title = this.user.title;
    this.description = this.user.description;
    this.img = this.user.img;
    let controlCategories = await this.observableService.getControlCategories();
    this.schedule = await this.observableService.getSchedule();

    if (!controlCategories) {

      try {

        this.categoryList = await this.apiService.getProductsOfRestaurantNew(this.id);
        console.log(this.categoryList);
        
        let typeData = (typeof this.categoryList === 'object') ? true : false;

        if (typeData) {
          if (Object.keys(this.categoryList).length === 0) {
            this.categoryList = [];
          }
        }

        this.observableService.changeCategoriesRestaurant(this.categoryList);

      } catch (error) {
        console.log(error);
      }

    } else {

      // get categories restaurant
      this.categoryList = await this.observableService.getCategoriesRestaurant();

    }

    this.flag = false;
  }

}
