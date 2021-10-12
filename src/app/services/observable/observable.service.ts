import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from "@ionic/storage-angular";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ObservableService {
  // user localStorage
  authUser: any;

  // initialize authUser -> User Authentication Verification
  private _authUser = new BehaviorSubject<any | null>(null);

  //observable authUser
  readonly _authUSelelected = this._authUser.asObservable();

  // initialize control categories
  private _controlCategories = new BehaviorSubject<boolean | null>(false);

  // initialize restaurant categories
  private _restaurantCategories = new BehaviorSubject<any[] | null>(null);

  // initialize departaments
  private _controlUpdate = new BehaviorSubject<boolean | null>(false);

  // initialize schedule
  private _schedule = new BehaviorSubject<any[] | null>([]);

  constructor(
    private storage: Storage,
  ) { }

  // <<<<<<<<<<<<<<<<<<<<<<<<< user >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async changeUserStorage(userData: any) {
    // save to localStorage
    await this.storage.set('vendor', userData);

    // update information
    this._authUser.next(userData);
    this.authUser = userData;
  }

  async getUserStorage() {
    return await this.storage.get('vendor');
  }

  async removeStorageUser() {
    await this.storage.remove('vendor');
    this._authUser.next(null);
  }

  async verifyStorage() {
    let user = await this.storage.get('vendor');

    if (user !== null) {
      this._authUser.next(user);
    }
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<< control categories >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async changeControlCategories(controlCategories: boolean | null) {
    this._controlCategories.next(controlCategories);
  }

  async getControlCategories() {
    return this._controlCategories.getValue();
  }

  async removeControlCategories() {
    this._controlCategories.next(false);
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<< categories restaurant >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async changeCategoriesRestaurant(restaurantCategories: any[]) {
    this._restaurantCategories.next(restaurantCategories);
  }

  async getCategoriesRestaurant() {
    return this._restaurantCategories.getValue();
  }

  async removeCategoriesRestaurant() {
    this._restaurantCategories.next(null);
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<< control update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async changeControlUpdate(controlUpdate: boolean | null) {
    this._controlUpdate.next(controlUpdate);
  }

  async getControlUpdate() {
    return this._controlUpdate.getValue();
  }

  async removeControlUpdate() {
    this._controlUpdate.next(false);
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<< message >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async changeSchedule(schedule: any[]) {
    this._schedule.next(schedule);
  }

  async getSchedule() {
    let day = (moment().weekday());
    let schedule_hours = this._schedule.getValue();
    let weekDay = schedule_hours[day];
    return weekDay[0];
  }

  async removeSchedule() {
    this._schedule.next([]);
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<< cache clear >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async cacheClear() {

  }
}
