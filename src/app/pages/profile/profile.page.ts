import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ObservableService } from 'src/app/services/observable/observable.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // object
  user: any;

  // boolean
  flag = false;

  // string
  userLang: string;

  constructor(
    private observableService: ObservableService,
    private formBuilder: FormBuilder,
    public utilService: UtilsService,
    private translate: TranslateService,

  ) {
  }

  async ngOnInit() {

    this.flag = true;

    this.user = await this.observableService.getUserStorage();
    this.flag = false;

  }
}
