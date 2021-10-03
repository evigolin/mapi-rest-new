// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  apiUrl: 'https://mimapi.club/wp-json/wc/v3/',
  // apiUrl: 'https://test.mimapi.club/wp-json/wc/v3/',
  
  firebaseConfig : {
    apiKey: "AIzaSyCZWKj-P2n3h9PieaMNIJ1JpbwPZAz9JT4",
    authDomain: "mapifood-backend.firebaseapp.com",
    databaseURL: "https://mapifood-backend-default-rtdb.firebaseio.com",
    projectId: "mapifood-backend",
    storageBucket: "mapifood-backend.appspot.com",
    messagingSenderId: "742495413692",
    appId: "1:742495413692:web:5b30124c242e04eecd37b9",
    measurementId: "G-9S7EE8FTX5"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
