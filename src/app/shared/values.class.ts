import { Injectable } from "@angular/core";

@Injectable()
export class Values {
  avatar: any = "assets/images/person.png";
  background: any = "assets/images/shopping.jpg";
  listview: boolean = true;
  count: number = 0;
  currency: any = "USD";
  role: any = "CUSTOMER";
  price: any;
  cart: Array<number> = [];
  qty: number = null;
  isLoggedIn: boolean = false;
  customerList: any;
  userRole: any = "";
  userChatData: any;
  userChatUserId: any;

  constructor() {}
}
