import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPage } from './products.page';

// import module
import { ProductsPageRoutingModule } from './products-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

// import plugins
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadImageModule, IntersectionObserverHooks, Attributes, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';

@Injectable() 
export class LazyLoadImageHooks extends IntersectionObserverHooks {
  setup (attributes: Attributes) {
    attributes.defaultImagePath = './assets/gift/loading.gif';
    attributes.errorImagePath = './assets/imgs/fondo_men.jpg';
    return super.setup(attributes);
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    LazyLoadImageModule,

  ],
  declarations: [ProductsPage],
  providers: [
    { provide: LAZYLOAD_IMAGE_HOOKS,
      useClass: LazyLoadImageHooks
    },
  ]
})
export class ProductsPageModule {}
