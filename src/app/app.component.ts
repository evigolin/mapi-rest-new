import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// import services
import { ConnectionStatus, NetworkService } from './services/network/network.service';
import { ObservableService } from './services/observable/observable.service';
import { OneSignalNotificationService } from './services/one-signal-notification/one-signal-notification.service';
import { UtilsService } from './services/utils/utils.service';

// import plugin
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';

// import native
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  // any
  user: any;

  // boolean
  flagLocationEvent: boolean = false;
  online: boolean = true;

  // storage
  private _storage: Storage | null = null;

  // string
  userLang: string;

  // subscription
  connectSubscription: Subscription;

  userData: any;

  constructor(
    private platform: Platform,
    private statusBarService: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private utilService: UtilsService,
    private router: Router,
    private translate: TranslateService,
    private networkService: NetworkService,
    private oneSignal: OneSignal,
    private oneSignalService: OneSignalNotificationService,
    private observableService: ObservableService,
    private navCtrl: NavController,
    public ngFireAuth: AngularFireAuth,

  ) {
    this.initStorage();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    if (this.connectSubscription) {
      // stop connect watch
      this.connectSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBarService.styleDefault();
      this.splashScreen.hide();

      // Initial App Language
      await this.utilService.setInitialAppLanguage();

      if (this.platform.is('cordova')) {
        this.setupPush();
      }

      // Check if there is a user saved in the phone storage
      await this.getStorageUser();



      this.controlHardwareButton();

      // detect connection
      this.DetectInternetConnectionOrDisconnection();

    });
  }

  DetectInternetConnectionOrDisconnection() {
    this.connectSubscription = this.networkService
      .onNetworkChange()
      .subscribe(async (status: ConnectionStatus) => {
        // this.offlineManager.checkForEvents().subscribe();
      });
  }

  setupPush() {
    console.log(environment.app_id_restaurant);
    
    this.oneSignal.startInit(
      '9b4e03db-8a8e-4e46-96fe-d516bad96dc0',
      '654129290571'
    );

    // TOKEN ONESIGNAL
    this.oneSignal.getIds().then(async (result) => {
      console.log('=== OneSignal Token ===> ', result);
      this.oneSignalService.setIdOnesignal(result.userId);
    });

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.None
    );

    this.oneSignal.handleNotificationReceived().subscribe(async (data) => {
      console.log(data);

        let msg = data.payload.body;
        let title = data.payload.title;
        let additionalData = data.payload.additionalData;
        this.utilService.getAlertNotification(
          // title,
          msg,
          // additionalData.task = ''
        );

    });

    this.oneSignal.handleNotificationOpened().subscribe(async (data) => {
      console.log(data);
      let additionalData = data.notification.payload.additionalData;

        // this.utilService.getAlertNotification(
        //   // 'Notification opened',
        //   'You already read this before',
        //   // additionalData.task
        // );
    });

    this.oneSignal.endInit();
  }

  private controlHardwareButton() {
    this.platform.pause.subscribe((observer) => {
      console.log('== APP ON BACKGROUND ==');
    });

    this.platform.resume.subscribe((observer) => {
      console.log('== APP RESUMED ==');
    });

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('backButton Subscriber');
      //control para que al abrir camara y hacer el return no cambie de vista
      // if (this.nativeCamera.handleBackFromCamera) {
      //   this.nativeCamera.handleBackFromCamera = false;
      //   return;
      // }

      if (!this.routerOutlet.canGoBack()) {
        if (this.router.url === '/login' || this.router.url === '/home') {
          //Confirmation that you want to exit the application
          let header = 'Information';
          let message = 'Are_you_sure_you_want_to_exit_the_application?';
          this.utilService.alertCloseApp(header, message);
        }
      }
    });
  }

  async getStorageUser() {
    await this.storage.get('vendor').then(async (user) => {
      if (user !== null) {
        this.user = user;
        await this.observableService.changeUserStorage(user);
        // schedule storage
        await this.observableService.changeSchedule(user.store_hours.day_times);
        this.navCtrl.navigateRoot('/home');

      } else {
        this.navCtrl.navigateRoot('/login');
      }
    });
  }

  // NEW STORAGE CONFIG

  private async initStorage() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }
}
