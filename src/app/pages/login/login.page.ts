import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// import services
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthService } from 'src/app/services/auth/auth.service';

// plugin
import { CustomValidators } from 'ngx-custom-validators';
import { TranslateService } from '@ngx-translate/core';

// import native
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // formGroup
  formLogin: FormGroup;

  // boolean
  offline: boolean = false;
  online: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private utilService: UtilsService,
    private authSvc: AuthService,
    private iab: InAppBrowser,
    private translate: TranslateService,
  ) {
    // form login
    this.formLogin = this.formBuilder.group({
      email: new FormControl('', [Validators.required, CustomValidators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  // <<<<<<<<<<<<<<<<<<<<<<<< fuctions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async loginUser() {
    if (this.formLogin.valid) {
      this.utilService.presentLoading(this.translate.instant('Processing'));
      let response = await this.authSvc.loginUser(this.formLogin.value);
    } else {
      let header = 'Error';
      let message = 'You_must_fill_all_the_fields';

      await this.utilService.alert(header, message);
    }
  }

  forgotPassword() {
    this.iab.create('https://mimapi.club/mi-cuenta/lost-password/', '_system');
  }

  register() {
    this.iab.create('https://mimapi.club/vendor-register/', '_system');
  }

  async languageSelected(event) {
    await this.utilService.setLanguage(event.detail.value);
  }

}
