import { ChangeDetectorRef, Component, NgZone, OnInit } from "@angular/core";

import { MenuController, NavController } from "@ionic/angular";

// import services
import { ObservableService } from 'src/app/services/observable/observable.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

// import plugins
import { TranslateService } from "@ngx-translate/core"; // add this

// import archive
import { menu, menus } from '../_archives/archivo.data';
import { menuInfo, menusInfo } from '../_archives/menuInfo.data';

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
  promosList: any;
  lastCupon: any;
  promo: any;

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
    private ngZone: NgZone

  ) {
    this.languages = this.utilService.getLanguages();
  }

  async ngOnInit() {

    this.observableService._authUSelelected.subscribe(user => {
      if (user || user != null) {
        this.user = user;
      }
    });

    // observable promos 
    this.observableService._promosSelelected.subscribe(promos => {
      if (promos || promos != null) {
        this.promosList = promos;
        this.promo = this.promosList[0];

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
    await this.observableService.removeStorageUser();
    await this.observableService.cacheClear();
    this.user = null;
    this.navCtrl.navigateRoot('/login');
    this.menuCtrl.enable(false);
  }
}
