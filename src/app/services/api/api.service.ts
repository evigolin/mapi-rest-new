import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { ObservableService } from '../observable/observable.service';
import { OneSignalNotificationService } from '../one-signal-notification/one-signal-notification.service';
import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword, User } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserFirebase, UserObject } from 'src/app/shared/user.class';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { UtilsService } from '../utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
// import 'firebase/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = environment.apiUrl;
  // string
  user: string;
  pass: string;
  url = environment.apiUrl;
  userData: any;

  // ref firebase
  private vendorRefDB =
    this.firedb.list<any>('vendors');

  // unknow
  httpOption;

  constructor(
    private http: HttpClient,
    private firedb: AngularFireDatabase,
    private observableService: ObservableService,
    private oneSignalService: OneSignalNotificationService,
    private ngFireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private afStore: AngularFirestore,
    private navCtrl: NavController,
    private utilService: UtilsService,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private translate: TranslateService,

  ) {

    // user localStorage
    // this.ngFireAuth.authState.subscribe(user => {
    //   console.log(user);

    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem('user-vendor', JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem('user-vendor'));
    //   } else {
    //     localStorage.setItem('user-vendor', null);
    //     JSON.parse(localStorage.getItem('user-vendor'));
    //   }
    // });

    // configuration
    this.user = 'Admint';
    this.pass = 'Colombia2020!';
    this.url = "https://mimapi.club";
    // this.url = 'https://test.mimapi.club';

    this.httpOption = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + 'QWRtaW50OkNvbG9tYmlhMjAyMCE',
      }),
    };
  }

  getProductsOfRestaurantNew(id) {
    return this.http
      .get(
        this.url + '/wp-json/wcfmmp/v1/products/?id=' + id,
        this.httpOption
      )
      .toPromise();
  }

  // firebase
  private getNewIDObject() {
    return this.firedb.createPushId();
  }
  //AGREGAR
  addVendor(user: any) {
    const id = this.getNewIDObject();
    let data: any = {
      _id: id,
      type_user: 'vendor',
      _id_onesignal: this.oneSignalService.getIdOnesignal(),
      image: user.img,
      email: user.email,
      info: {
        id: user.id,
        name: user.title,
        address: {
          address: user.address,
          state: user.state,
          city: user.city,
          country: user.country
        },

        phone: user.phone,

      },
      orders: [],
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    }

    return this.vendorRefDB.set(id, data).then(() => {
      return data;
    });
  }

  //ELMINAR
  removeVendor(idVendor: string) {
    return this.vendorRefDB.remove(idVendor);
  }

  async getUserRestaurantID(id: string) {
    return await this.firedb.database.ref('vendors/' + id).get();
  }

  async getUserRestaurantEmail(email: string) {
    return this.vendorRefDB.query.orderByChild('email').equalTo(email).get();
  }

  async verifyUserFirebase(userAuth) {
    let password = userAuth.email.replace("@", "") + userAuth.email.replace("@", "");

    console.log('=============== Sign In================');
    /////////////////// check the user exists by logging in //////////////////////////
    await this.SignIn(userAuth.email, password).then(async (result) => {

      console.log('=============== get User Restaurant Email ================');
      /////////////////// Obtaining information from the database ////////////////////
      await this.getUserRestaurantEmail(userAuth.email).then(async (resp) => {

        let vendor = Object.values(resp.val())[0];
        userAuth['id_firebase'] = vendor['_id'];
        console.log(vendor['_id']);

        // if (this.oneSignalService.getIdOnesignal() !== '') {
        console.log('=============== set Id Onesignal ================');

        ////////////////////////////////// set id onesignal in firebase ///////////////
        await this.setIdOnesignal(userAuth['id_firebase']).then(async (result) => {
          // update user localStorage
          await this.observableService.changeUserStorage(userAuth);

          // dissmiss loading
          await this.utilService.dismissLoading();
          console.log('=============== redirect home ================');
          // redirect
          this.navCtrl.navigateRoot('/home');

        }).catch(async (errs) => {
          console.log(errs);
          const errorCode = errs.code;
          console.log(errorCode);

          // dissmiss loading
          await this.utilService.dismissLoading();

          if (errs.status && (errs.status === 500 || errs.status === 0)) {
            let header = 'Error';
            let message = 'Connection_error';

            // alert
            await this.utilService.alert(header, message);

            await this.observableService.removeStorageUser();
            await this.observableService.cacheClear();
            this.user = null;

            // loading dismiss
            this.utilService.dismissLoading();

            // redirect
            this.navCtrl.navigateRoot('/login');
            this.menuCtrl.enable(false);

          } else {
            let header = 'Error';
            let message = 'Apparently_something_is_wrong_try_again';
            await this.alertContinueSetIdOnesignal(header, message, userAuth);
          }
        });

        /////////////////////////////////////////////////////////////////////////////
        // }


      }).catch(async (err) => {
        console.log(err);

        const errorCode = err.code;
        console.log(errorCode);

        // dissmiss loading
        await this.utilService.dismissLoading();

        if (err.status && (err.status === 500 || err.status === 0)) {
          let header = 'Error';
          let message = 'Connection_error';

          // alert
          await this.utilService.alert(header, message);

          await this.observableService.removeStorageUser();
          await this.observableService.cacheClear();
          this.user = null;

          // loading dismiss
          this.utilService.dismissLoading();

          // redirect
          this.navCtrl.navigateRoot('/login');
          this.menuCtrl.enable(false);

        } else {
          let header = 'Error';
          let message = 'Apparently_something_is_wrong_try_again';
          await this.alertOption(header, message, userAuth);
        }
      });

      /////////////////////////////////////////////////////////////////////////////

    }, async (error) => {
      console.log(error);
      // dissmiss loading
      await this.utilService.dismissLoading();

      const errorCode = error.code;
      console.log(errorCode);

      // Unregistered user
      if (errorCode === 'auth/user-not-found') {

        ///////////////////////// registering user ////////////////////////////////
        console.log('=============== Registe rUser ================');

        await this.RegisterUser().then(async (userCredential) => {

          // Signed in
          const userFirebase = userCredential.user;

          // log in and save restaurant information
          await this.getRestaurant(userAuth, password);

        }).catch(async (error) => {
          console.log(error);

          const errorCode = error.code;
          console.log(errorCode);

          // dissmiss loading
          await this.utilService.dismissLoading();

          if (error.status && (error.status === 500 || error.status === 0)) {
            let header = 'Error';
            let message = 'Connection_error';

            // alert
            await this.utilService.alert(header, message);

            await this.observableService.removeStorageUser();
            await this.observableService.cacheClear();
            this.user = null;

            // loading dismiss
            this.utilService.dismissLoading();

            // redirect
            this.navCtrl.navigateRoot('/login');
            this.menuCtrl.enable(false);

          } else {
            let header = 'Error';
            let message = 'Apparently_something_is_wrong_try_again';
            await this.alertOption(header, message, userAuth);
          }
          // ..
        });

        /////////////////////////////////////////////////////////////////////////////

      } else if (error.status && (error.status === 500 || error.status === 0)) {
        let header = 'Error';
        let message = 'Connection_error';

        // alert
        await this.utilService.alert(header, message);

        await this.observableService.removeStorageUser();
        await this.observableService.cacheClear();
        this.user = null;

        // loading dismiss
        this.utilService.dismissLoading();

        // redirect
        this.navCtrl.navigateRoot('/login');
        this.menuCtrl.enable(false);

      } else {
        let header = 'Error';
        let message = 'Apparently_something_is_wrong_try_again';
        await this.alertOption(header, message, userAuth);
      }

    });
    ////////////////////////////////////////////////////////////////////////////////

  }

  async RegisterUser() {
    const auth = getAuth();
    let user = await this.observableService.getUserStorage();
    let password = user.email.replace("@", "") + user.email.replace("@", "");

    return await createUserWithEmailAndPassword(auth, user.email, password);

  }


  // Login in with email/password
  async SignIn(email, password) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email has been sent, please check your inbox.');
      }).catch(async (error) => {
        window.alert(error);
        // dissmiss loading
        await this.utilService.dismissLoading();
      })
  }

  // Returns true when user is looged in
  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Sign in with Gmail
  // GoogleAuth() {
  //   return this.AuthLogin(new auth.GoogleAuthProvider());
  // }

  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const userData: UserFirebase = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign-out 
  async SignOut() {
    this.utilService.presentLoading(this.translate.instant('Closing_session'));
    let userAuth = await this.observableService.getUserStorage();

    ////////////////// Obtaining information from the database ////////////////////
    await this.getUserRestaurantEmail(userAuth.email).then(async (resp) => {
      console.log(resp.val());

      let vendor = Object.values(resp.val())[0];
      let id_onesignal = this.oneSignalService.getIdOnesignal();
      console.log(vendor['_id_onesignal']);
      console.log(id_onesignal);

      // loading dismiss
      this.utilService.dismissLoading();

      if (id_onesignal !== '' && id_onesignal === vendor['_id_onesignal']) {

        return await this.removeIdOnesignal().then(async () => {

          return await this.ngFireAuth.signOut().then(async () => {
            // localStorage.removeItem('user-vendor');
            // this.router.navigate(['login']);
            // loading dismiss
            this.utilService.dismissLoading();

          }).catch(async (errs) => {
            console.log(errs);

            const errorCode = errs.code;
            console.log(errorCode);
            await this.observableService.removeStorageUser();
            await this.observableService.cacheClear();
            this.user = null;

            // loading dismiss
            this.utilService.dismissLoading();

            // redirect
            this.navCtrl.navigateRoot('/login');
            this.menuCtrl.enable(false);

          });

        }).catch(async (error) => {
          console.log(error);

          const errorCode = error.code;
          console.log(errorCode);

          // loading dismiss
          this.utilService.dismissLoading();

          if (error.status && (error.status === 500 || error.status === 0)) {
            let header = 'Error';
            let message = 'Connection_error';

            // alert
            await this.utilService.alert(header, message);

          } else {

            let header = 'Error';
            let message = 'Apparently_something_is_wrong_try_again';
            await this.alertCloseSe(header, message);
          }
        });

      } else {

        return await this.ngFireAuth.signOut().then(async () => {
          // localStorage.removeItem('user-vendor');
          // this.router.navigate(['login']);
          // loading dismiss
          this.utilService.dismissLoading();

        }).catch(async (errs) => {
          console.log(errs);

          const errorCode = errs.code;
          console.log(errorCode);

          await this.observableService.removeStorageUser();
          await this.observableService.cacheClear();
          this.user = null;

          // loading dismiss
          this.utilService.dismissLoading();

          // redirect
          this.navCtrl.navigateRoot('/login');
          this.menuCtrl.enable(false);

        });
      }

    }).catch(async (err) => {
      console.log(err);

      const errorCode = err.code;
      console.log(errorCode);

      // dissmiss loading
      await this.utilService.dismissLoading();

      if (err.status && (err.status === 500 || err.status === 0)) {
        let header = 'Error';
        let message = 'Connection_error';

        // alert
        await this.utilService.alert(header, message);

        await this.observableService.removeStorageUser();
        await this.observableService.cacheClear();
        this.user = null;

        // loading dismiss
        this.utilService.dismissLoading();

        // redirect
        this.navCtrl.navigateRoot('/login');
        this.menuCtrl.enable(false);

      } else {
        let header = 'Error';
        let message = 'Apparently_something_is_wrong_try_again';
        await this.alertCloseSession(header, message);
      }
    });

  }

  async getRestaurant(userAuth, password) {
    console.log('=============== Sign In ================');
    // log in restaurant
    await this.SignIn(userAuth.email, password).then(async (result) => {
      console.log('=============== add Vendor ================');
      // add restaurant in database
      await this.addVendor(userAuth).then(async (result) => {
        console.log(result._id);

        userAuth['id_firebase'] = result._id;

        // update user localStorage
        await this.observableService.changeUserStorage(userAuth);

        // dissmiss loading
        await this.utilService.dismissLoading();
        // redirect
        this.navCtrl.navigateRoot('/home');

      }).catch(async (err) => {
        console.log(err);

        const errorCode = err.code;
        console.log(errorCode);

        // dissmiss loading
        await this.utilService.dismissLoading();

        if (err.status && (err.status === 500 || err.status === 0)) {
          let header = 'Error';
          let message = 'Connection_error';

          // alert
          await this.utilService.alert(header, message);

          await this.observableService.removeStorageUser();
          await this.observableService.cacheClear();
          this.user = null;

          // loading dismiss
          this.utilService.dismissLoading();

          // redirect
          this.navCtrl.navigateRoot('/login');
          this.menuCtrl.enable(false);

        } else {
          let header = 'Error';
          let message = 'Apparently_something_is_wrong_try_again';
          await this.alertOption(header, message, userAuth, 2);
        }
      });

    }).catch(async (error) => {
      console.log(error);

      const errorCode = error.code;
      console.log(errorCode);

      // dissmiss loading
      await this.utilService.dismissLoading();

      if (error.status && (error.status === 500 || error.status === 0)) {
        let header = 'Error';
        let message = 'Connection_error';

        // alert
        await this.utilService.alert(header, message);

        await this.observableService.removeStorageUser();
        await this.observableService.cacheClear();
        this.user = null;

        // loading dismiss
        this.utilService.dismissLoading();

        // redirect
        this.navCtrl.navigateRoot('/login');
        this.menuCtrl.enable(false);

      } else {
        let header = 'Error';
        let message = 'Apparently_something_is_wrong_try_again';
        await this.alertOption(header, message, userAuth);
      }

    });

  }

  async setReadTrue(order: any) {
    let user = await this.observableService.getUserStorage();

    console.log(user);
    console.log(order);
    console.log(user.id_firebase);
    console.log(order._id);

    const vendorRefDB = this.firedb.list<any>(`vendors/${user.id_firebase}/orders/${order._id}`);
    let _id_onesignal = this.oneSignalService.getIdOnesignal();
    console.log(_id_onesignal);
    return vendorRefDB.set('read', true).then(async (result) => {
      return true;
    });
  }

  async setIdOnesignal(id_firebase: string) {
    let user = await this.observableService.getUserStorage();
    const vendorRefDB = this.firedb.list<any>(`vendors/${id_firebase}`);
    let _id_onesignal = this.oneSignalService.getIdOnesignal();
    console.log(_id_onesignal);
    return vendorRefDB.set('_id_onesignal', _id_onesignal).then(async (result) => {
      user['_id_onesignal'] = _id_onesignal;
      await this.observableService.changeUserStorage(user);
      return user;
    });
  }

  async removeIdOnesignal() {
    let user = await this.observableService.getUserStorage();
    const vendorRefDB = this.firedb.list<any>(`vendors/${user.id_firebase}/_id_onesignal`);

    return await vendorRefDB.remove();
  }

  async addVendorBucle(userAuth) {
    // add restaurant in database
    console.log('=============== add Vendor ================');
    await this.addVendor(userAuth).then(async (result) => {
      console.log(result._id);

      userAuth['id_firebase'] = result._id;

      // update user localStorage
      await this.observableService.changeUserStorage(userAuth);

      // dissmiss loading
      await this.utilService.dismissLoading();
      // redirect
      this.navCtrl.navigateRoot('/home');

    }).catch(async (err) => {
      console.log(err);

      const errorCode = err.code;
      console.log(errorCode);

      // dissmiss loading
      await this.utilService.dismissLoading();

      if (err.status && (err.status === 500 || err.status === 0)) {
        let header = 'Error';
        let message = 'Connection_error';

        // alert
        await this.utilService.alert(header, message);

        await this.observableService.removeStorageUser();
        await this.observableService.cacheClear();
        this.user = null;

        // loading dismiss
        this.utilService.dismissLoading();

        // redirect
        this.navCtrl.navigateRoot('/login');
        this.menuCtrl.enable(false);

      } else {
        let header = 'Error';
        let message = 'Apparently_something_is_wrong_try_again';
        await this.alertOption(header, message, userAuth, 2);
      }
    });
  }

  async continueSetIdOnesignal(userAuth) {

    // if (this.oneSignalService.getIdOnesignal() !== '') {
    ////////////////////////////////// set id onesignal in firebase ///////////////
    console.log('=============== set Id Onesignal ================');
    await this.setIdOnesignal(userAuth['id_firebase']).then(async (result) => {

      // update user localStorage
      await this.observableService.changeUserStorage(userAuth);

      // dissmiss loading
      await this.utilService.dismissLoading();
      // redirect
      this.navCtrl.navigateRoot('/home');

    }).catch(async (errs) => {
      console.log(errs);
      const errorCode = errs.code;
      console.log(errorCode);

      // dissmiss loading
      await this.utilService.dismissLoading();

      if (errs.status && (errs.status === 500 || errs.status === 0)) {
        let header = 'Error';
        let message = 'Connection_error';

        // alert
        await this.utilService.alert(header, message);

        await this.observableService.removeStorageUser();
        await this.observableService.cacheClear();
        this.user = null;

        // loading dismiss
        this.utilService.dismissLoading();

        // redirect
        this.navCtrl.navigateRoot('/login');
        this.menuCtrl.enable(false);

      } else {
        let header = 'Error';
        let message = 'Apparently_something_is_wrong_try_again';
        await this.alertContinueSetIdOnesignal(header, message, userAuth);
      }
    });
    // }

  }

  // ===================================== Observables =================================
  getOrdersObservable(userId: string) {
    console.log('=============== get Orders Observable ================');
    return this.firedb.list<any>(`vendors/${userId}/orders`, ref => ref.orderByChild('createdAt')).valueChanges();

    // return this.firedb.object<any>(`vendors/${userId}/orders`).valueChanges();
  }

  // ===================================== Alert =================================

  async alertOption(header, message, user: any, option?: number) {

    const alert = await this.alertCtrl.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            console.log('Confirm Cancel: blah');

            // clear data localStorage
            await this.observableService.removeStorageUser();
            await this.observableService.cacheClear();
            this.user = null;

            // loading dismiss
            this.utilService.dismissLoading();

            // redirect
            this.navCtrl.navigateRoot('/login');
            this.menuCtrl.enable(false);
          }
        }, {
          text: this.translate.instant('yes'),
          handler: async () => {
            this.utilService.presentLoading(this.translate.instant('Processing'));
            console.log('=============== alert Option ================');
            if (option) {
              await this.addVendorBucle(user);
            } else {
              await this.verifyUserFirebase(user);
            }

          }
        }
      ]
    });

    await alert.present();
  }

  async alertCloseSe(header, message) {

    const alert = await this.alertCtrl.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            console.log('Confirm Cancel: blah');
            // loading dismiss
            this.utilService.dismissLoading();
          }
        }, {
          text: this.translate.instant('yes'),
          handler: async () => {
            console.log('=============== alert CloseSe ================');
            this.utilService.presentLoading(this.translate.instant('Processing'));
            await this.SignOut();
          }
        }
      ]
    });

    await alert.present();
  }

  async alertCloseSession(header, message) {

    const alert = await this.alertCtrl.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            console.log('Confirm Cancel: blah');
            // loading dismiss
            this.utilService.dismissLoading();
          }
        }, {
          text: this.translate.instant('yes'),
          handler: async () => {
            console.log('=============== alert Close Session ================');
            this.utilService.presentLoading(this.translate.instant('Processing'));
            await this.SignOut();
          }
        }
      ]
    });

    await alert.present();
  }

  async alertContinueSetIdOnesignal(header, message, userAuth) {
    // dissmiss loading
    await this.utilService.dismissLoading();

    const alert = await this.alertCtrl.create({
      header: this.translate.instant(header),
      message: this.translate.instant(message),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            console.log('Confirm Cancel: blah');

            // clean information localStorage
            await this.observableService.cacheClear();

            // message confirmation
            let header = 'Information';
            let message = 'It_is_possible_that_you_will_not_receive_notifications_because_the_complete_flow_was_not_done';
            await this.utilService.getAlertConfirm(header, message);
          }
        }, {
          text: this.translate.instant('yes'),
          handler: async () => {
            console.log('=============== alert Continue Set Id Onesignal ================');

            this.utilService.presentLoading(this.translate.instant('Processing'));
            await this.continueSetIdOnesignal(userAuth);

          }
        }
      ]
    });

    await alert.present();
  }

}

