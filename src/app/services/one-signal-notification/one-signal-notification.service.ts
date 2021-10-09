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
  onesignal: string = '';

  constructor(
    private http: HttpClient,
    private utilService: UtilsService,
    private navCtrl: NavController,

  ) {
    // header http
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: "Basic NWI5ZDFkNTAtMTM0MC00YmJiLWE3NzYtNjIwNjBiMmRiMDBl",
      }),
    };
  }

  async sendNotification() {
    let data = {
      app_id: 'c4f73897-aabd-4867-bc56-9673d99496d2',
      include_player_ids: ['4bdc815f-6d10-480e-a61f-344d4f50f9d3'],
      heading: { en: 'My notification title' },
      contents: { en: 'So much content' },
      data: { task: 'Send' }
    };

    await this.http.post(
      `https://onesignal.com/api/v1/notifications`, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic NWI5ZDFkNTAtMTM0MC00YmJiLWE3NzYtNjIwNjBiMmRiMDBl"
        }
    }
    ).toPromise<any>()
      .then(async (response) => {
        console.log(response);

        // dissmis loading
        await this.utilService.dismissLoading();
      })
      .catch(async (error) => {
        console.log(error);
      });
  }

  setIdOnesignal(id: string) {
    this.onesignal = id;
  }

  getIdOnesignal() {
    return this.onesignal;
  }
}
