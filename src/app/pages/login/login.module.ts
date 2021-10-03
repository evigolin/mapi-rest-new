import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

// import module
import { ComponentsModule } from 'src/app/components/components.module';

// declared pages
import { LoginPage } from './login.page';
import { TranslateModule } from '@ngx-translate/core';
// import { CustomFormsModule } from 'ngx-custom-validators';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    // CustomFormsModule,
    LoginPageRoutingModule,
    TranslateModule,
    ComponentsModule,

  ],
  declarations: [LoginPage]
})
export class LoginPageModule { }
