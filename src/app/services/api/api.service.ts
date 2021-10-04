import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = environment.apiUrl;
  // string
  user: string;
  pass: string;
  url = environment.apiUrl;

  // unknow
  httpOption;

  constructor(
    private http: HttpClient,

  ) {
    // configuration
    this.user = 'Admint';
    this.pass = 'Colombia2020!';
    // this.url = "https://mimapi.club";
    this.url = 'https://test.mimapi.club';

    // header http
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Methods': '*',
    });

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

}
