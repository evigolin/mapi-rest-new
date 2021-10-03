import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';

// import module
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import native
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';


// import plugins
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Drivers } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';
import { TranslateLoader } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,

  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    // LazyLoadImageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      defaultLanguage: 'en',
    }),
    IonicStorageModule.forRoot(
      {
        name: '__mapi_food_new',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      }
    ),


  ],
  providers: [
    Storage,
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Network,
    OneSignal,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,

    },
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
