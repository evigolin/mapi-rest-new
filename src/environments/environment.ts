// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  apiUrl: 'https://mimapi.club/wp-json/wc/v3/',
  // apiUrl: 'https://test.mimapi.club/wp-json/wc/v3/',
  
  firebaseConfig : {
    apiKey: "AIzaSyDLFGjnkNR3UHiLlrqWogLgxKs3LM8njIs",
    authDomain: "mapifood-backend-8b842.firebaseapp.com",
    databaseURL: "https://mapifood-backend-8b842-default-rtdb.firebaseio.com",
    projectId: "mapifood-backend-8b842",
    storageBucket: "mapifood-backend-8b842.appspot.com",
    messagingSenderId: "654129290571",
    appId: "1:654129290571:web:bac03346d8719d22d69cce",
    measurementId: "G-DYJPSHPMR4"
  },

  app_id_restaurant : '9b4e03db-8a8e-4e46-96fe-d516bad96dc0',
  app_id_client : '90e9a99d-b286-4988-816f-9ee368ea0d5d',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
