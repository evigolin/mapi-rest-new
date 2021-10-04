import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from "@ionic/storage-angular";

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

  // initialize restaurant
  private _restaurant = new BehaviorSubject<any | null>(null);

  // initialize control categories
  private _controlCategories = new BehaviorSubject<boolean | null>(false);

  // initialize restaurant categories
  private _restaurantCategories = new BehaviorSubject<any[] | null>(null);

  // initialize departaments
  private _controlUpdate = new BehaviorSubject<boolean | null>(false);

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

  // <<<<<<<<<<<<<<<<<<<<<<<<< restaurant >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async changeRestaurant(restaurant: any) {
    this._restaurant.next(restaurant);
  }

  async getRestaurant() {
    return this._restaurant.getValue();
  }

  async removeRestaurant() {
    this._restaurant.next(null);
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

  // <<<<<<<<<<<<<<<<<<<<<<<<< cache clear >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async cacheClear() {

  }
}
