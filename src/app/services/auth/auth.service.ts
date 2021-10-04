import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

// import services
import { UtilsService } from '../utils/utils.service';
import { ObservableService } from '../observable/observable.service';

// import plugins
import { TranslateService } from '@ngx-translate/core';

// import inteface
import { User } from 'src/app/shared/user.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // unknow
  httpOption;

  // string
  url = environment.apiUrl;

  constructor(
    private utilService: UtilsService,
    private http: HttpClient,
    private observableService: ObservableService,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private translate: TranslateService,

  ) {
    // header http
    this.httpOption = {
      headers: new HttpHeaders({
        Authorization: "Basic " + "QWRtaW50OkNvbG9tYmlhMjAyMCE",
      }),
    };
  }

  // function login
  async loginUser(user: User) {

    const username = user.email;
    const password = user.password;

    // url
    const url = "https://test.mimapi.club";
    // const url = "https://mimapi.club";

    // http get token
    return await new Promise(async (resolve, reject) => {
      this.http.post<any>(
        `${url}/wp-json/jwt-auth/v1/token`, { username, password }
      ).toPromise()
        .then(
          async (response) => { // Success          
            console.log(response);

            // get request the information of the logged in user
            await this.http.get(
              `${this.url}customers?role=wcfm_vendor&email=${response.user_email}`, this.httpOption
            ).toPromise<any>().then(async (result) => {
              console.log(result);

              if (result.length === 0) {
                let header = 'Error';
                let message = 'User_not_found_to_enjoy_our_services_we_invite_you_to_register';

                // dissmiss loading
                await this.utilService.dismissLoading();
                // alert
                await this.utilService.alert(header, message);
                this.navCtrl.navigateRoot('/register');
                return;
              }

              const userProfile = result[0];

              // initialize object with the user information that will be stored in the phone storage
              let user = {
                img: userProfile.avatar_url,
                phone: userProfile.billing.phone,
                cd: userProfile.billing.postcode,
                email: userProfile.email,
                username: userProfile.email,
                first_name: userProfile.first_name,
                last_name: userProfile.last_name,
                id: userProfile.id,
                billing: {
                  address_1: userProfile.billing.address_1,
                  address_2: userProfile.billing.address_2,
                  city: userProfile.billing.city,
                  company: userProfile.billing.company,
                  country: userProfile.billing.country,
                  email: userProfile.billing.email,
                  first_name: userProfile.billing.first_name,
                  last_name: userProfile.billing.last_name,
                  phone: userProfile.billing.phone,
                  postcode: userProfile.billing.postcode,
                  state: userProfile.billing.state,
                },
                shipping: {
                  address_1: userProfile.shipping.address_1,
                  address_2: userProfile.shipping.address_2,
                  city: userProfile.shipping.city,
                  company: userProfile.shipping.company,
                  country: userProfile.shipping.country,
                  first_name: userProfile.shipping.first_name,
                  last_name: userProfile.shipping.last_name,
                  postcode: userProfile.shipping.postcode,
                  state: userProfile.shipping.state,
                }
              };

              // save storage
              this.observableService.changeUserStorage(user);
              // active menu
              this.menuCtrl.enable(true);
              // dissmiss loading
              await this.utilService.dismissLoading();

              // redirect
              this.navCtrl.navigateRoot('/home');

            }).catch(async (err) => {
              console.log(err);

              // message
              let header = 'Error';
              let message;

              if (err.status === 500 || err.status === 0) {
                message = 'Connection_error';
              }

              await this.utilService.dismissLoading();

              // alert
              await this.utilService.alert(header, message);
            });

          }).catch(async (errs) => {

            console.log(errs);
            let header = 'Error';
            let message;

            if (errs.error.code === '[jwt_auth] invalid_email') {
              message = 'Email_address_is_invalid';
            } else if (errs.error.code === '[jwt_auth] incorrect_password') {
              message = 'The_password_you_have_entered_is_incorrect.';
            } else {
              message = 'Connection_error';
            }

            // dissmis loading
            await this.utilService.dismissLoading();

            // alert
            await this.utilService.alert(header, message);

          });
    });
  }

  async updateUser(data) {

    let user = await this.observableService.getUserStorage();

    await this.http.put(
      `${this.url}customers/${user.id}`, data, this.httpOption
    ).toPromise<any>()
      .then(async response => {
        // console.log(response);

        // update user in localStorage
        let user = response;
        // console.log(user);

        // save storage
        await this.observableService.changeUserStorage(user);
        await this.observableService.changeControlUpdate(true);

        // dissmiss loading
        await this.utilService.dismissLoading();

        let header = 'Information';
        let message = 'Successful_Update';
        this.utilService.getAlertConfirm(header, message);
        this.navCtrl.navigateRoot('/home');

      })
      .catch(async (error) => {
        console.log(error);
        await this.utilService.dismissLoading();

        let header = 'Error';
        let message = 'Connection_error'
        this.utilService.alert(header, message);

      });
  }
}
