import { ChangeDetectorRef, Component, NgZone, OnInit } from "@angular/core";

import { MenuController, NavController } from "@ionic/angular";

// import services
import { ObservableService } from 'src/app/services/observable/observable.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

// import plugins
import { TranslateService } from "@ngx-translate/core";

// import archive
import { menu, menus } from '../_archives/archivo.data';
import { menuInfo, menusInfo } from '../_archives/menuInfo.data';
import { ApiService } from "src/app/services/api/api.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {

  // observable
  // componentesAccount: Observable<Componente[]>;
  // componentesInfo: Observable<Componente[]>;

  // string
  selected: string = '';

  // data
  languages = [];

  // any
  user: any;

  // arrays
  componentesAccount: menu[] = menus;
  componentesInfo: menuInfo[] = menusInfo;

  // boolean
  flagLocationEvent: boolean = false;
  flag: boolean = true;

  constructor(
    private translate: TranslateService,
    public menuCtrl: MenuController,
    private observableService: ObservableService,
    private navCtrl: NavController,
    public utilService: UtilsService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private apiService: ApiService,

  ) {
    this.languages = this.utilService.getLanguages();
  }

  async ngOnInit() {

    this.observableService._authUSelelected.subscribe(user => {
      if (user || user != null) {
        this.user = user;
      }
    });

    setTimeout(() => {
      this.selected = this.utilService.selected;

      this.flag = false;

      this.ngZone.run(_ => {
        this.cdr.detectChanges();
      });
    }, 3000);

  }

  async languageSelected(event) {

    if (event && event.detail && event.detail.value && event.detail.value !== '') {
      await this.utilService.setLanguage(event.detail.value);
    }
  }

  async logout() {
    this.utilService.presentLoading(this.translate.instant('Processing'));
    this.apiService.SignOut().then(async (result) => {
      console.log(result);

      await this.observableService.removeStorageUser();
      await this.observableService.cacheClear();
      this.user = null;

       // loading dismiss
      this.utilService.dismissLoading();

      // redirect
      this.navCtrl.navigateRoot('/login');
      this.menuCtrl.enable(false);

    }).catch(error => {
      console.log(error);

      // loading dismiss
      this.utilService.dismissLoading();
    });

  }
}
