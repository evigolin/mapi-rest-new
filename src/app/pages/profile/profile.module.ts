import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadImageModule, IntersectionObserverHooks, Attributes, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';

@Injectable()
export class LazyLoadImageHooks extends IntersectionObserverHooks {
  setup(attributes: Attributes) {
    attributes.defaultImagePath = './assets/imgs/profile.jpg';
    attributes.errorImagePath = './assets/imgs/profile.jpg';
    return super.setup(attributes);
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ComponentsModule,
    TranslateModule,
    LazyLoadImageModule,

  ],
  declarations: [ProfilePage],
  providers: [
    {
      provide: LAZYLOAD_IMAGE_HOOKS,
      useClass: LazyLoadImageHooks
    },
  ]
})
export class ProfilePageModule {}
