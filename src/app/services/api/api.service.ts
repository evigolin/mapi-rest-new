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
import { NavController } from '@ionic/angular';
import { UtilsService } from '../utils/utils.service';
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

  ) {

    // user localStorage
    this.ngFireAuth.authState.subscribe(user => {
      console.log(user);

      if (user) {
        this.userData = user;
        localStorage.setItem('user-vendor', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user-vendor'));
      } else {
        localStorage.setItem('user-vendor', null);
        JSON.parse(localStorage.getItem('user-vendor'));
      }
    })

    // configuration
    this.user = 'Admint';
    this.pass = 'Colombia2020!';
    // this.url = "https://mimapi.club";
    this.url = 'https://test.mimapi.club';

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

  // //LISTAR
  // getListVendor() {
  //   return this.firedb.database
  //     .ref('vendor')
  //     .orderByChild('createdAt')
  //     .get();
  // }

  // //ACTUALIZAR DESTRUCTIVO
  // updateDestructiveVendor(
  //   idVendor: string,
  //   formUdpate: {
  //     nameEn: string;
  //     nameEs: string;
  //     imageUrl: string;
  //     imagePath: string;
  //     status: boolean;
  //   }
  // ) {
  //   this.vendorRefDB.set(idVendor, {
  //     _id: idVendor,
  //     name: {
  //       en: formUdpate.nameEn,
  //       es: formUdpate.nameEs,
  //     },
  //     status: formUdpate.status,
  //     updatedAt: firebase.database.ServerValue.TIMESTAMP,
  //   });
  // }

  // //ACTUALIZAR NORMAL
  // updateVendor(
  //   idVendor: string,
  //   formUdpate: {
  //     nameEn: string;
  //     nameEs: string;
  //     imageUrl: string;
  //     imagePath: string;
  //     status: boolean;
  //   }
  // ) {
  //   return this.vendorRefDB.update(idVendor, {
  //     _id: idVendor,
  //     name: {
  //       en: formUdpate.nameEn,
  //       es: formUdpate.nameEs,
  //     },
  //     status: formUdpate.status,
  //     updatedAt: firebase.database.ServerValue.TIMESTAMP,
  //   });
  // }

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

    // check the user exists by logging in
    await this.SignIn(userAuth.email, password).then(async (result) => {
      console.log(result);
      
      // Obtaining information from the database
      await this.getUserRestaurantEmail(userAuth.email).then(async (resp) => {
        console.log(resp);

        let vendor = Object.values(resp.val())[0];
        console.log(vendor['_id']);
        userAuth['id_firebase'] = vendor['_id'];
        console.log(userAuth);

       // update user localStorage
        await this.observableService.changeUserStorage(userAuth);

        // dissmiss loading
        await this.utilService.dismissLoading();
        // redirect
        this.navCtrl.navigateRoot('/home');

      }).catch(async (err) => {
        console.log(err);
        // dissmiss loading
        await this.utilService.dismissLoading();
        // redirect
        this.navCtrl.navigateRoot('/home');
      });

    }, async (error) => {
      console.log(error);

      const errorCode = error.code;

      // Unregistered user
      if (errorCode === 'auth/user-not-found') {

        // registering user
        await this.RegisterUser().then(async (userCredential) => {

          // Signed in
          const userFirebase = userCredential.user;

          // log in and save restaurant information
          await this.getRestaurant(userAuth, password);

        }).catch(async (error) => {
          // dissmiss loading
          await this.utilService.dismissLoading();
          // ..
        });
      }
    });

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
      }).catch((error) => {
        window.alert(error)
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
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user-vendor');
      this.router.navigate(['login']);
    })
  }

  async getRestaurant(userAuth, password) {

    // log in restaurant
    await this.SignIn(userAuth.email, password).then(async (result) => {

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
        // dissmiss loading
        await this.utilService.dismissLoading();
      });

    }).catch(async (err) => {
      console.log(err);

      // dissmiss loading
      await this.utilService.dismissLoading();
    });

  }

  // ===================================== Observables =================================
  getOrdersObservable(userId: string) {

    return this.firedb.list<any>(`vendors/${userId}/orders`).valueChanges(['child_added']);

    // return this.firedb.object<any>(`vendors/${userId}/orders`).valueChanges();
  }
}
