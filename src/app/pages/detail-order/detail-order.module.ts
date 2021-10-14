import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailOrderPageRoutingModule } from './detail-order-routing.module';

import { DetailOrderPage } from './detail-order.page';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailOrderPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    LazyLoadImageModule,
  ],
  declarations: [DetailOrderPage]
})
export class DetailOrderPageModule {}
