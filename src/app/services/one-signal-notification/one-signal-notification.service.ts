import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class OneSignalNotificationService {
  // unknow
  httpOption;

  // string
  url: 'https://onesignal/api/v1/notifications';

  constructor(
    private http: HttpClient,
    private utilService: UtilsService,
    private navCtrl: NavController,

  ) {
    // header http
    this.httpOption = {
      headers: new HttpHeaders({
        // 'content-type' : 'Application/json',
        Authorization: "Basic " + "NWI5ZDFkNTAtMTM0MC00YmJiLWE3NzYtNjIwNjBiMmRiMDBl",
      }),
    };
  }

  async sendNotification() {
    let data = {
      app_id: '4bdc815f-6d10-480e-a61f-344d4f50f9d3',
      included_segments: ['Active Users'],
      heading: { en: 'My notification title' },
      contents: { en: 'So much content' },
      data: { task: 'Send' }
    };

    await this.http.post(
      `${this.url}`, data, this.httpOption
    ).toPromise<any>()
      .then(async (response) => {
        console.log(response);

        // dissmis loading
        await this.utilService.dismissLoading();
      })
      .catch(async (error) => {
        console.log(error);

        // dissmis loading
        await this.utilService.dismissLoading();

        let header = 'Error';
        let message = 'Please_check_your_connection';

        // alert
        this.utilService.alert(header, message);
      });
  }
}
