import { Injectable } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';

// import native
import { Storage } from "@ionic/storage-angular";

// import plugins
import { TranslateService } from '@ngx-translate/core';

// const
const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  // any
  loading: HTMLIonLoadingElement;

  // string
  selected = '';

  constructor(
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private translate: TranslateService,
    private storage: Storage,

  ) {

  }

  // ===================== translate ============================ //
  async setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    await this.storage.get(LNG_KEY).then(async (val) => {

      if (val) {
        await this.setLanguage(val);
        this.selected = val;

      } else {
        await this.setLanguage(language);
        this.selected = language;
      }
    });

    console.log(this.selected);
    
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en' },
      { text: 'Spanish', value: 'es' },
    ];
  }

  async setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
    await this.storage.set(LNG_KEY, lng);
  }

  // ===================== alert ============================ //

  async alert(header: string, message: string, subHeader?: string) {
    let alert;

    if (subHeader) {
      alert = await this.alertCtrl.create({
        header: this.translate.instant(header),
        subHeader: this.translate.instant(subHeader),
        message: this.translate.instant(message),
        buttons: ["OK"]
      });

    } else {
      alert = await this.alertCtrl.create({
        header: this.translate.instant(header),
        message: this.translate.instant(message),
        buttons: ["OK"]
      });
    }

    await alert.present();
  }

  async getAlertConfirm(header, message) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.navCtrl.navigateRoot('/home');
          }
        }
      ]
    });

    await alert.present();
  }

  async getAlertNotification(title, msg) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant(title),
      message: this.translate.instant(msg),
      buttons: [
        {
          text: `Ok`,
          handler: () => {
            // 
          }
        }
      ]
    });

    await alert.present();
  }

  async alertCloseApp(header, message) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      buttons: [
        {
          text: this.translate.instant('cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });

    await alert.present();
  }

  async alertCancelOrder(header, message) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: async () => {
            // await this.observableService.cacheClear();
            this.navCtrl.navigateRoot('/home');
          }
        }
      ]
    });

    await alert.present();
  }

  async getAlert(message) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('Alert'),
      message: this.translate.instant(message),
      buttons: [
        {
          text: "Aceptar",

        }
      ]
    });

    await alert.present();
  }

  async presentAlertErr(message: string) {
    const alert = await this.alertCtrl.create({
      message: this.translate.instant(message),
      buttons: [
        {
          text: "Ok",
          role: this.translate.instant('cancel'),
        }
      ]
    });
    await alert.present();
  }


  // ===================== loading ============================ //

  // Initialize loading
  async presentLoading(message) {
    this.loading = await this.loadingController.create({
      message,
    });
    await this.loading.present();
  }

  // Dismiss loading
  async dismissLoading() {
    return await this.loadingController.getTop().then(loading => {
      if (loading)
        loading.dismiss().then(() => console.log('loading dismissed'));
    });
  }

  // ===================== function ============================ //

  srcFailBackImg(event, urlBackup = './assets/imgs/fondo_men.jpg') {
    event.target.src = urlBackup;
  }

  getObjectInformation(userInformation: any) {
    console.log(userInformation);
    
    for (const info of userInformation.meta_data) {
      if (info.key === 'wcfmmp_profile_settings') {

        // initialize object with the user information that will be stored in the phone storage
        let user = {
          img: userInformation.avatar_url,
          phone: info.value.phone,
          cd: info.value.address.country,
          email: userInformation.email,
          username: userInformation.email,
          first_name: userInformation.first_name,
          last_name: userInformation.last_name,
          _id: userInformation.id,
          address: info.value.address.street_1,
          country: info.value.address.country,
          postcode: info.value.address.zip,
          state: info.value.address.state,
          city: info.value.address.city,
          title: info.value.store_name,
          description: info.value.shop_description,
          store_hours: info.value['wcfm_store_hours'] ? info.value['wcfm_store_hours'] : ''
        };

        return user;
      }
    }

  }

}
