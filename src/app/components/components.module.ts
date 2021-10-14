import { Injectable, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// import plugins
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { LazyLoadImageModule, IntersectionObserverHooks, Attributes, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';

// import components
import { NetworkComponent } from "./network/network.component";
import { MenuComponent } from "./menu/menu.component";
import { HeaderLanguageComponent } from "./header-language/header-language.component";
import { HeaderComponent } from "./header/header.component";



@Injectable()
export class LazyLoadImageHooks extends IntersectionObserverHooks {
  setup(attributes: Attributes) {
    attributes.defaultImagePath = './assets/imgs/profile.jpg';
    attributes.errorImagePath = './assets/imgs/profile.jpg';
    return super.setup(attributes);
  }
}


@NgModule({
  declarations: [
    MenuComponent,
    NetworkComponent,
    HeaderLanguageComponent,
    HeaderComponent,

  ],
  exports: [
    MenuComponent,
    RouterModule,
    NetworkComponent,
    HeaderLanguageComponent,
    HeaderComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
    IonicModule,
    LazyLoadImageModule,

  ],
  providers: [
    {
      provide: LAZYLOAD_IMAGE_HOOKS,
      useClass: LazyLoadImageHooks
    },
  ]
})
export class ComponentsModule { }
