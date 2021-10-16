import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
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

  async sendNotification(id) {
    let data = {
      app_id: '90e9a99d-b286-4988-816f-9ee368ea0d5d',
      include_player_ids: [id],
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
    console.log(id);
    
    this.onesignal = id;
  }

  getIdOnesignal() {
    return this.onesignal;
  }
}
