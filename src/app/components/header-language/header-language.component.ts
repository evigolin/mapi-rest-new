import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';

// import services
import { UtilsService } from 'src/app/services/utils/utils.service';

// import plugins
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-language',
  templateUrl: './header-language.component.html',
  styleUrls: ['./header-language.component.scss'],
})
export class HeaderLanguageComponent implements OnInit {
  // string
  selected: string;

  // array
  languages = [];

  constructor(
    private utilService: UtilsService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone

  ) {
    this.languages = this.utilService.getLanguages();
  }

  ngOnInit() {
    this.selected = this.utilService.selected;

    this.ngZone.run(_ => {
      this.cdr.detectChanges();
    })

  }

  ionionViewWillEnter() {
    this.selected = this.utilService.selected;

    this.ngZone.run(_ => {
      this.cdr.detectChanges();
    })

  }

  async languageSelected(event) {
    this.utilService.setLanguage(event.detail.value);
  }

}
