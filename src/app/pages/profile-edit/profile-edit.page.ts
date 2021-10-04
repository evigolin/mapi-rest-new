import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ObservableService } from 'src/app/services/observable/observable.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { User } from 'src/app/shared/user.class';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

  // any
  img: any;
  user: any;

  // object
  userCustom: User = new User();

  // fornGroup
  form: FormGroup;

  // any || string
  stateSelected: any | string = '';
  stateLastSelected: any | string = '';
  citySelected: any | string = '';
  stateSelected_1: any | string = '';
  stateLastSelected_1: any | string = '';
  citySelected_1: any | string = '';

  // arrays
  departaments: any[] = [];

  // boolean
  flag = false;

  // string
  userLang: string;

  constructor(
    private observableService: ObservableService,
    private formBuilder: FormBuilder,
    public utilService: UtilsService,
    private translate: TranslateService,
    private auth: AuthService,

  ) {
    // form
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      lastName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      email: new FormControl(''),
      phone: new FormControl('', [Validators.required]),
      doc: new FormControl('', [Validators.required]),
      address_1_billing: new FormControl('', [Validators.required]),
      address_2_billing: new FormControl(''),
      phone_billing: new FormControl(''),
      city_billing: new FormControl('', [Validators.required]),
      state_billing: new FormControl('', [Validators.required]),
      country_billing: new FormControl('', [Validators.required]),
      firstName_billing: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      lastName_billing: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      address_1_shipping: new FormControl('', [Validators.required]),
      address_2_shipping: new FormControl(''),
      city_shipping: new FormControl('', [Validators.required]),
      state_shipping: new FormControl('', [Validators.required]),
      country_shipping: new FormControl('', [Validators.required]),
      firstName_shipping: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      lastName_shipping: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      checkBoxShipping: new FormControl(true),
    });
  }

  async ngOnInit() {

    this.flag = true;

    this.user = await this.observableService.getUserStorage();
    this.img = this.user.img;

    this.form = this.formBuilder.group({
      firstName: new FormControl(this.user.first_name, [Validators.required]),
      lastName: new FormControl(this.user.last_name, [Validators.required]),
      birthDay: new FormControl(''),
      email: new FormControl({ value: this.user.email, disabled: true }),
      address_1_billing: new FormControl(this.user.billing.address_1, [Validators.required]),
      phone_billing: new FormControl(this.user.billing.phone, [Validators.required]),
      city_billing: new FormControl('', [Validators.required]),
      state_billing: new FormControl('', [Validators.required]),
      country_billing: new FormControl('CO', [Validators.required]),
      firstName_billing: new FormControl(this.user.first_name, [Validators.required]),
      lastName_billing: new FormControl(this.user.last_name, [Validators.required]),
      address_1_shipping: new FormControl(this.user.shipping.address_1, [Validators.required]),
      city_shipping: new FormControl('', [Validators.required]),
      state_shipping: new FormControl('', [Validators.required]),
      country_shipping: new FormControl('CO', [Validators.required]),
      firstName_shipping: new FormControl(this.user.first_name, [Validators.required]),
      lastName_shipping: new FormControl(this.user.last_name, [Validators.required]),
      checkBoxShipping: new FormControl(true),
    });

    if (this.departaments.length !== 0) {
      this.setInformation();
    }

    this.verifyInformation();
    this.flag = false;
  }

  update() {

    if (this.form.get('checkBoxShipping').value) {

      this.form.get('address_1_shipping').setValue(this.form.get('address_1_billing').value);
      this.form.get('city_shipping').setValue(this.form.get('city_billing').value);
      this.form.get('state_shipping').setValue(this.form.get('state_billing').value);
      this.form.get('country_shipping').setValue(this.form.get('country_billing').value);
    }

    if (this.form.valid) {
      // loading
      this.utilService.presentLoading(this.translate.instant('Updating_information'));

      let data = {
        first_name: this.form.get('firstName').value,
        last_name: this.form.get('lastName').value,
        billing: {
          address_1: this.form.get('address_1_billing').value,
          city: (this.form.get('city_billing').value).name,
          country: this.form.get('country_billing').value,
          first_name: this.form.get('firstName').value,
          last_name: this.form.get('lastName').value,
          phone: this.form.get('phone_billing').value,
          state: (this.form.get('state_billing').value).name,
        },
        shipping: {
          address_1: this.form.get('address_1_shipping').value,
          country: this.form.get('country_shipping').value,
          city: (this.form.get('city_shipping').value).name,
          first_name: this.form.get('firstName').value,
          last_name: this.form.get('lastName').value,
          state: (this.form.get('state_shipping').value).name,
        }
      }


      this.auth.updateUser(data);

    } else {
      this.form.markAllAsTouched();
    }

  }

  get f() {
    return this.form.controls;
  }

  test() {
    console.log(this.form.value);
  }

  verifyInformation() {
    if (this.form.get('address_1_shipping').value === '' && this.form.get('address_1_billing').value === '' && this.form.get('city_shipping').value === '' && this.form.get('city_billing').value == '' && this.form.get('state_shipping').value === '' && this.form.get('state_billing').value === '') {
      this.form.get('checkBoxShipping').setValue(true);
      this.informationShipping();
    } else if (this.form.get('address_1_shipping').value === this.form.get('address_1_billing').value && this.form.get('city_shipping').value === this.form.get('city_billing').value && this.form.get('state_shipping').value === this.form.get('state_billing').value) {
      this.form.get('checkBoxShipping').setValue(true);
      this.informationShipping();
    } else {
      this.form.get('checkBoxShipping').setValue(false);
    }
  }

  informationShipping() {

    if (this.form.get('checkBoxShipping').value) {

      this.form.get('address_1_shipping').setValue(this.form.get('address_1_billing').value);
      this.form.get('city_shipping').setValue(this.form.get('city_billing').value);
      this.form.get('state_shipping').setValue(this.form.get('state_billing').value);
      this.citySelected_1 = this.citySelected;
      this.stateSelected_1 = this.stateSelected;

    } else {

      this.form.get('address_1_shipping').setValue('');
      this.form.get('city_shipping').setValue('');
      this.form.get('state_shipping').setValue('');
      this.citySelected_1 = '';
      this.stateSelected_1 = '';
    }

  }

  state(event) {
    this.citySelected = '';
  }

  stateShipping(event) {
    this.citySelected_1 = '';
  }

  setInformation() {
    if ((this.user.shipping.state.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === this.user.billing.state.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) && (this.user.shipping.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === this.user.billing.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {

      for (const departament of this.departaments) {
        if (this.user.shipping.state.toLowerCase() === departament.name.toLowerCase()) {
          this.stateSelected = departament;
          this.stateSelected_1 = departament;
          this.stateLastSelected = departament;
          this.stateLastSelected_1 = departament;
          this.form.get('state_billing').setValue(departament);
          this.form.get('state_shipping').setValue(departament);

          for (const mun of departament.Municipalities) {
            if (mun.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === this.user.shipping.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
              this.citySelected = mun;
              this.citySelected_1 = mun;
              this.form.get('city_shipping').setValue(mun);
              this.form.get('city_billing').setValue(mun);
            }
          }
        }
      }

    } else {

      for (const department of this.departaments) {
        if (this.user.billing.state.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === department.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
          this.stateSelected = department;
          this.stateLastSelected = department;
          this.form.get('state_billing').setValue(department);

          for (const item of department.Municipalities) {
            if (item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === this.user.billing.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
              this.citySelected = item;
              this.form.get('city_billing').setValue(item);
            }
          }
        }

        if (this.user.shipping.state.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === department.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
          this.stateSelected_1 = department;
          this.stateLastSelected_1 = department;
          this.form.get('state_shipping').setValue(department);

          for (const mun of department.Municipalities) {
            if (mun.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === this.user.billing.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
              this.citySelected_1 = mun;
              this.form.get('city_shipping').setValue(mun);
            }
          }
        }
      }
    }
  }

}
