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

  constructor(
    private storage: Storage,
  ) { }

  // <<<<<<<<<<<<<<<<<<<<<<<<< user >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async changeUserStorage(userData: any) {
    // save to localStorage
    await this.storage.set('user', userData);

    // update information
    this._authUser.next(userData);
    this.authUser = userData;
  }

  async getUserStorage() {
    return await this.storage.get('user');
  }

  async removeStorageUser() {
    await this.storage.remove('user');
    this._authUser.next(null);
  }

  async verifyStorage() {
    let user = await this.storage.get('user');

    if (user !== null) {
      this._authUser.next(user);
    }
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<< cache clear >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async cacheClear() {

  }
}
