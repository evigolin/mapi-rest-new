export class User {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  phone?: any;
  doc?: any;
}

export interface UserObject {
  _id?: number,
  img?: string,
  phone?: string,
  cd?: string,
  email?: string,
  username?: string,
  first_name?: string,
  last_name?: string,
  id?: number,
  address?: string,
  country?: string,
  postcode?: string,
  state?: string,
  city?: string,
  title?: string,
  description?: string
}

export interface UserFirebase {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

